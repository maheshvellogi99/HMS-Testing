const HeartPlusLogo = ({ className = "w-12 h-12", color = "#7C3AED" }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Heart Shape */}
      <path
        d="M50,85 
           C25,65 15,50 15,35 
           C15,20 25,15 35,15 
           C42,15 47,18 50,25
           C53,18 58,15 65,15
           C75,15 85,20 85,35
           C85,50 75,65 50,85 Z"
        fill={color}
        stroke={color}
        strokeWidth="2"
      />
      
      {/* Plus Sign Inside Heart */}
      <g fill="white">
        {/* Vertical bar of + */}
        <rect x="46" y="35" width="8" height="30" rx="2" />
        
        {/* Horizontal bar of + */}
        <rect x="35" y="46" width="30" height="8" rx="2" />
      </g>
    </svg>
  );
};

export default HeartPlusLogo;
