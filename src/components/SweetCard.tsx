import React from 'react';
import { ShoppingCart } from 'lucide-react';

// --- DEFINED LOCALLY TO FIX IMPORT ERROR ---
export interface Sweet {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description?: string;
}
// -------------------------------------------

interface Props {
  sweet: Sweet;
  onPurchase: (id: string) => void;
}

const SweetCard: React.FC<Props> = ({ sweet, onPurchase }) => {
  const isOutOfStock = sweet.quantity === 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{sweet.name}</h3>
          <span className="text-xs font-semibold text-pink-500 bg-pink-50 px-2 py-1 rounded-md">
            {sweet.category}
          </span>
        </div>
        <p className="text-lg font-bold text-gray-900">${sweet.price}</p>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Stock: {isOutOfStock ? <span className="text-red-500">Out of Stock</span> : sweet.quantity}
      </p>

      <button
        onClick={() => onPurchase(sweet.id)}
        disabled={isOutOfStock}
        className={`w-full flex items-center justify-center space-x-2 py-2 rounded-lg font-medium transition
          ${isOutOfStock 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-gray-900 text-white hover:bg-gray-800 active:scale-95'
          }`}
      >
        <ShoppingCart size={18} />
        <span>{isOutOfStock ? 'Sold Out' : 'Purchase'}</span>
      </button>
    </div>
  );
};

export default SweetCard;