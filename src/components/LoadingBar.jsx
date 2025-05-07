import { useState, useEffect } from "react";

const LoadingBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer;
    if (progress < 100) {
      timer = setInterval(() => {
        setProgress((prevProgress) => Math.min(prevProgress + 10, 100));
      }, 500);
    }
    return () => clearInterval(timer);
  }, [progress]);

  return (
    <div style={{ width: '100%', backgroundColor: '#e0e0e0', height: '4px' }}>
      <div className={`h-[100%] bg-[#76c7c0]`}
        style={{
          width: `${progress}%`,
          transition: 'width 0.5s ease-out',
        }}
      />
    </div>
  );
};

export default LoadingBar;
