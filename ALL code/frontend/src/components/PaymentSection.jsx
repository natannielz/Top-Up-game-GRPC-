import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Smartphone, CreditCard, QrCode, ChevronDown, ChevronUp, Check } from 'lucide-react';

const paymentCategories = [
  {
    id: 'ewallet',
    title: 'E-Wallet',
    methods: [
      { id: 'gopay', name: 'GoPay', icon: Wallet, fee: '2%' },
      { id: 'dana', name: 'DANA', icon: Smartphone, fee: '2%' },
      { id: 'ovo', name: 'OVO', icon: Wallet, fee: '2%' },
      { id: 'shopeepay', name: 'ShopeePay', icon: Wallet, fee: '2%' },
    ]
  },
  {
    id: 'qris',
    title: 'QRIS',
    methods: [
      { id: 'qris_all', name: 'QRIS All Payment', icon: QrCode, fee: '0.7%' },
    ]
  },
  {
    id: 'va',
    title: 'Virtual Account',
    methods: [
      { id: 'bca_va', name: 'BCA Virtual Account', icon: CreditCard, fee: 'Rp 4000' },
      { id: 'bri_va', name: 'BRI Virtual Account', icon: CreditCard, fee: 'Rp 4000' },
      { id: 'mandiri_va', name: 'Mandiri Virtual Account', icon: CreditCard, fee: 'Rp 4000' },
      { id: 'bni_va', name: 'BNI Virtual Account', icon: CreditCard, fee: 'Rp 4000' },
    ]
  },
  {
    id: 'mart',
    title: 'Convenience Store',
    methods: [
      { id: 'alfamart', name: 'Alfamart', icon: Wallet, fee: 'Rp 5000' },
      { id: 'indomaret', name: 'Indomaret', icon: Wallet, fee: 'Rp 5000' },
    ]
  }
];

const PaymentSection = ({ selectedPayment, onSelect }) => {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const toggleCategory = (id) => {
    setExpandedCategory(prev => prev === id ? null : id);
  };

  return (
    <section className="relative group">
      <div className="flex gap-6">
        <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-cyber-dark border border-pink-500/30 flex items-center justify-center text-xl font-bold font-orbitron text-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.2)] group-hover:scale-110 transition-transform relative z-10">
          3
        </div>
        <div className="flex-1 pt-2">
          <h3 className="text-2xl font-orbitron font-bold text-white mb-6 flex items-center gap-3">
            Payment Method
            {selectedPayment && (
              <span className="text-xs font-sans font-normal px-2 py-1 rounded bg-pink-500/20 text-pink-400 border border-pink-500/30">
                Selected: {selectedPayment.name}
              </span>
            )}
          </h3>

          <div className="space-y-4">
            {paymentCategories.map((category) => (
              <div key={category.id} className="border border-white/10 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-pink-500/30">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${expandedCategory === category.id ? 'bg-pink-500/20 text-pink-400' : 'bg-white/10 text-gray-400'}`}>
                      {category.id === 'ewallet' && <Wallet size={20} />}
                      {category.id === 'qris' && <QrCode size={20} />}
                      {category.id === 'va' && <CreditCard size={20} />}
                      {category.id === 'mart' && <Wallet size={20} />}
                    </div>
                    <span className={`font-bold text-lg ${expandedCategory === category.id ? 'text-white' : 'text-gray-300'}`}>
                      {category.title}
                    </span>
                  </div>
                  {expandedCategory === category.id ? (
                    <ChevronUp size={20} className="text-pink-400" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-500" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedCategory === category.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 pt-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 border-t border-white/5">
                        {category.methods.map((method) => (
                          <div
                            key={method.id}
                            onClick={() => onSelect(method)}
                            className={`relative flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-300 group/item
                                                            ${selectedPayment?.id === method.id
                                ? 'bg-gradient-to-br from-pink-900/40 to-purple-900/40 border-cyber-cyan ring-1 ring-cyber-cyan shadow-[0_0_15px_rgba(0,255,255,0.3)]'
                                : 'bg-black/20 border-white/5 hover:border-white/20 hover:bg-black/40'
                              }
                                                        `}
                          >
                            {selectedPayment?.id === method.id && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-cyber-cyan text-black rounded-full flex items-center justify-center shadow-lg z-10">
                                <Check size={12} strokeWidth={4} />
                              </div>
                            )}

                            <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-lg group-hover/item:scale-105 transition-transform">
                              {/* Placeholder icons, ideally these would be brand logos */}
                              <method.icon size={24} className="text-black" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={`text-sm font-bold leading-tight ${selectedPayment?.id === method.id ? 'text-white' : 'text-gray-300'}`}>
                                {method.name}
                              </div>
                              <div className="text-[10px] text-gray-500 mt-1 font-mono">
                                Fee: <span className="text-emerald-400">{method.fee}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentSection;
