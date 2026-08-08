import { useEffect, useState } from "react";

const StatCard = ({ value, label, description, isDark }) => {

  const [count,setCount] = useState(0);

  useEffect(()=>{
    let start = 0;

    const timer = setInterval(()=>{
      start += Math.ceil(value / 50);

      if(start >= value){
        start = value;
        clearInterval(timer);
      }

      setCount(start);

    },30);

    return ()=>clearInterval(timer);

  },[value]);


  return (
    <div className={`md:mt-20 rounded-3xl border p-6 transition-all duration-500 hover:-translate-y-2 ${isDark ? "border-white/10 bg-white/5 backdrop-blur-xl hover:shadow-xl hover:shadow-blue-500/20" : "border-slate-200 bg-white shadow-lg"}`}>

      <h3 className={`text-4xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
        {count}+
      </h3>

      <p className={`mt-3 text-lg font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
        {label}
      </p>

      <p className={`mt-1 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
        {description}
      </p>

    </div>
  );
};

export default StatCard;