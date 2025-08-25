import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { cartService } from "@/services/api/cartService";
import { productService } from "@/services/api/productService";
import { orderService } from "@/services/api/orderService";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const [shippingForm, setShippingForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States"
  });

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: ""
  });

  const [shippingMethod, setShippingMethod] = useState("standard");

  useEffect(() => {
    loadCheckoutData();
  }, []);

  const loadCheckoutData = async () => {
    setLoading(true);
    setError("");
    try {
      const [items, allProducts] = await Promise.all([
        cartService.getCartItems(),
        productService.getAll()
      ]);
      
      const activeItems = items.filter(item => !item.savedForLater);
      
      if (activeItems.length === 0) {
        navigate("/cart");
        return;
      }
      
      setCartItems(activeItems);
      setProducts(allProducts);
    } catch (err) {
      setError("Failed to load checkout data");
    } finally {
      setLoading(false);
    }
  };

  const getProductById = (productId) => {
    return products.find(p => p.Id.toString() === productId.toString());
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const product = getProductById(item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const getShippingCost = () => {
    const subtotal = calculateSubtotal();
    if (subtotal >= 50) return 0;
    
    switch (shippingMethod) {
      case "express":
        return 19.99;
      case "overnight":
        return 29.99;
      default:
        return 9.99;
    }
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return subtotal * 0.08;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + getShippingCost() + calculateTax();
  };

  const validateShippingForm = () => {
    const requiredFields = ["firstName", "lastName", "email", "phone", "address", "city", "state", "zipCode"];
    for (const field of requiredFields) {
      if (!shippingForm[field].trim()) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`);
        return false;
      }
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingForm.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    
    return true;
  };

  const validatePaymentForm = () => {
    if (!paymentForm.cardNumber.replace(/\s/g, "").match(/^\d{16}$/)) {
      toast.error("Please enter a valid 16-digit card number");
      return false;
    }
    
    if (!paymentForm.expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
      toast.error("Please enter expiry date in MM/YY format");
      return false;
    }
    
    if (!paymentForm.cvv.match(/^\d{3,4}$/)) {
      toast.error("Please enter a valid CVV");
      return false;
    }
    
    if (!paymentForm.cardholderName.trim()) {
      toast.error("Please enter cardholder name");
      return false;
    }
    
    return true;
  };

  const handleShippingSubmit = () => {
    if (validateShippingForm()) {
      setCurrentStep(2);
    }
  };

  const handlePaymentSubmit = async () => {
    if (!validatePaymentForm()) return;

    setIsProcessing(true);
    try {
      // Create order
      const orderData = {
        items: cartItems,
        subtotal: calculateSubtotal(),
        shipping: getShippingCost(),
        tax: calculateTax(),
        total: calculateTotal(),
        shippingAddress: shippingForm,
        paymentMethod: {
          type: "card",
          last4: paymentForm.cardNumber.slice(-4)
        },
        shippingMethod
      };

      const order = await orderService.create(orderData);
      
      // Clear cart
      await cartService.clearCart();
      
      // Navigate to confirmation
      navigate("/order-confirmation", { 
        state: { orderId: order.Id, orderTotal: calculateTotal() }
      });
      
    } catch (error) {
      toast.error("Failed to process payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : v;
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCheckoutData} />;

  const steps = [
    { number: 1, title: "Shipping", icon: "Truck" },
    { number: 2, title: "Payment", icon: "CreditCard" },
    { number: 3, title: "Confirmation", icon: "CheckCircle" }
  ];

  const shippingOptions = [
    { id: "standard", name: "Standard Shipping", time: "5-7 business days", price: 9.99 },
    { id: "express", name: "Express Shipping", time: "2-3 business days", price: 19.99 },
    { id: "overnight", name: "Overnight Shipping", time: "Next business day", price: 29.99 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl lg:text-4xl text-gray-900 mb-6">
            Checkout
          </h1>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex items-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200
                    ${currentStep >= step.number 
                      ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg"
                      : "bg-gray-200 text-gray-600"
                    }
                  `}>
                    <ApperIcon name={step.icon} size={20} />
                  </div>
                  <span className={`
                    ml-2 font-medium
                    ${currentStep >= step.number ? "text-primary" : "text-gray-500"}
                  `}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    w-16 h-0.5 mx-4 transition-all duration-200
                    ${currentStep > step.number ? "bg-primary" : "bg-gray-200"}
                  `} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="font-display font-semibold text-xl text-gray-900 mb-6">
                  Shipping Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <Input
                      value={shippingForm.firstName}
                      onChange={(e) => setShippingForm(prev => ({...prev, firstName: e.target.value}))}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <Input
                      value={shippingForm.lastName}
                      onChange={(e) => setShippingForm(prev => ({...prev, lastName: e.target.value}))}
                      placeholder="Enter last name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={shippingForm.email}
                      onChange={(e) => setShippingForm(prev => ({...prev, email: e.target.value}))}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <Input
                      value={shippingForm.phone}
                      onChange={(e) => setShippingForm(prev => ({...prev, phone: e.target.value}))}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <Input
                      value={shippingForm.address}
                      onChange={(e) => setShippingForm(prev => ({...prev, address: e.target.value}))}
                      placeholder="Enter street address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <Input
                      value={shippingForm.city}
                      onChange={(e) => setShippingForm(prev => ({...prev, city: e.target.value}))}
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <Input
                      value={shippingForm.state}
                      onChange={(e) => setShippingForm(prev => ({...prev, state: e.target.value}))}
                      placeholder="Enter state"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code
                    </label>
                    <Input
                      value={shippingForm.zipCode}
                      onChange={(e) => setShippingForm(prev => ({...prev, zipCode: e.target.value}))}
                      placeholder="Enter ZIP code"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Shipping Method
                  </label>
                  <div className="space-y-3">
                    {shippingOptions.map((option) => (
                      <label key={option.id} className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          name="shipping"
                          value={option.id}
                          checked={shippingMethod === option.id}
                          onChange={(e) => setShippingMethod(e.target.value)}
                          className="text-primary focus:ring-primary"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{option.name}</p>
                              <p className="text-sm text-gray-500">{option.time}</p>
                            </div>
                            <span className="font-semibold text-gray-900">
                              {calculateSubtotal() >= 50 && option.id === "standard" 
                                ? "Free" 
                                : formatPrice(option.price)
                              }
                            </span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <Button variant="primary" size="lg" onClick={handleShippingSubmit} className="w-full">
                  Continue to Payment
                  <ApperIcon name="ArrowRight" size={20} className="ml-2" />
                </Button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display font-semibold text-xl text-gray-900">
                    Payment Information
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentStep(1)}
                  >
                    <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
                    Back
                  </Button>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <Input
                      value={paymentForm.cardNumber}
                      onChange={(e) => setPaymentForm(prev => ({
                        ...prev, 
                        cardNumber: formatCardNumber(e.target.value)
                      }))}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <Input
                        value={paymentForm.expiryDate}
                        onChange={(e) => setPaymentForm(prev => ({
                          ...prev, 
                          expiryDate: formatExpiryDate(e.target.value)
                        }))}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <Input
                        value={paymentForm.cvv}
                        onChange={(e) => setPaymentForm(prev => ({
                          ...prev, 
                          cvv: e.target.value.replace(/\D/g, "").substring(0, 4)
                        }))}
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name
                    </label>
                    <Input
                      value={paymentForm.cardholderName}
                      onChange={(e) => setPaymentForm(prev => ({...prev, cardholderName: e.target.value}))}
                      placeholder="Enter cardholder name"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <ApperIcon name="Shield" size={16} className="text-success" />
                    <span>Your payment information is encrypted and secure</span>
                  </div>
                </div>

                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={handlePaymentSubmit}
                  disabled={isProcessing}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="CreditCard" size={20} className="mr-2" />
                      Complete Order
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
              <h2 className="font-display font-semibold text-xl text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                {cartItems.map((item) => {
                  const product = getProductById(item.productId);
                  if (!product) return null;
                  
                  return (
                    <div key={item.productId} className="flex items-center gap-3">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 line-clamp-1">
                          {product.title}
                        </p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-semibold text-sm text-gray-900">
                        {formatPrice(product.price * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(calculateSubtotal())}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>
                    {getShippingCost() === 0 ? (
                      <span className="text-success font-medium">Free</span>
                    ) : (
                      formatPrice(getShippingCost())
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>{formatPrice(calculateTax())}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {formatPrice(calculateTotal())}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;