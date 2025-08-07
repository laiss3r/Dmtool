interface TradeTypeSelectorProps {
  tradeType: 'Digits' | 'UpDown';
  setTradeType: (type: 'Digits' | 'UpDown') => void;
}

function TradeTypeSelector({ tradeType, setTradeType }: TradeTypeSelectorProps) {
  return (
    <div className="mb-4">
      <label className="block text-lg font-medium">Select Trade Type</label>
      <div className="flex space-x-4 mt-2">
        <button
          onClick={() => setTradeType('Digits')}
          className={`p-2 rounded ${tradeType === 'Digits' ? 'bg-blue-600' : 'bg-gray-600'}`}
        >
          Digits
        </button>
        <button
          onClick={() => setTradeType('UpDown')}
          className={`p-2 rounded ${tradeType === 'UpDown' ? 'bg-blue-600' : 'bg-gray-600'}`}
        >
          Up and Down
        </button>
      </div>
    </div>
  );
}

export default TradeTypeSelector;
