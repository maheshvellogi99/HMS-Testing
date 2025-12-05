const HospitalBuilding = () => {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Large circular background */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-100 rounded-full -z-10 opacity-40"></div>
      
      {/* Hospital Building Image */}
      <div className="relative z-10 animate-fadeIn">
        <img 
          src="/building.png" 
          alt="ChikitsaMitra Hospital Building"
          className="w-full h-auto animate-scaleIn"
          style={{ 
            filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
            animation: 'fadeIn 0.8s ease-out, scaleIn 0.8s ease-out'
          }}
        />
      </div>
    </div>
  );
};

export default HospitalBuilding;
