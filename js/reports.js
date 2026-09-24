
// reports.js - Reports & Analytics with Chart.js
(function(){
var R=React; var h=R.createElement; var icons=window.lucideReact||{};

function ChartCard(props){
  var canvasRef=R.useRef(null);
  var chartRef=R.useRef(null);
  R.useEffect(function(){
    if(!canvasRef.current||typeof Chart==='undefined')return;
    if(chartRef.current){chartRef.current.destroy();}
    try{chartRef.current=new Chart(canvasRef.current,props.config);}catch(e){console.warn('Chart error:',e);}
    return function(){if(chartRef.current){chartRef.current.destroy();chartRef.current=null;}};
  },[]);
  return h(window.Card,{className:'p-5'},
    h('h4',{className:'font-semibold text-gray-800 text-sm mb-3'},props.title),
    h('div',{className:'chart-container'},h('canvas',{ref:canvasRef}))
  );
}

window.ReportsPage=function ReportsPage(){
  var ctx=R.useContext(window.AppContext);
  var state=ctx.state;
  var periodState=R.useState('weekly'); var period=periodState[0]; var setPeriod=periodState[1];
  var Dw=icons.Download; var BarC=icons.BarChart3;

  var phcNames=state.phcs.slice(0,8).map(function(p){return p.name.replace('PHC ','');});
  var phcWaiting=state.phcs.slice(0,8).map(function(p){return p.patientsWaiting;});
  var phcWaitTime=state.phcs.slice(0,8).map(function(p){return p.avgWaitingTime;});

  var days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  var specs=window.SPECIALIZATIONS||['General Medicine','Paediatrics','OBG','Dental','AYUSH'];
  var specAvail=specs.map(function(s){return state.doctors.filter(function(d){return d.specialization===s&&d.status==='available';}).length;});
  var specAbsent=specs.map(function(s){return state.doctors.filter(function(d){return d.specialization===s&&d.status!=='available';}).length;});

  var medStat={available:0,low:0,out:0,near:0,exp:0};
  state.medicines.forEach(function(m){
    if(m.status==='available')medStat.available++;
    else if(m.status==='low-stock')medStat.low++;
    else if(m.status==='out-of-stock')medStat.out++;
    else if(m.status==='near-expiry')medStat.near++;
    else if(m.status==='expired')medStat.exp++;
  });

  var BLUE='rgba(37,99,235,0.8)';var TEAL='rgba(13,148,136,0.8)';var GREEN='rgba(22,163,74,0.8)';
  var RED='rgba(239,68,68,0.8)';var ORANGE='rgba(249,115,22,0.8)';var YELLOW='rgba(234,179,8,0.8)';

  var charts=[
    {title:'Doctor Attendance Trend (Last 7 Days)',config:{type:'line',data:{labels:days,datasets:[
      {label:'Present',data:[75,78,72,80,76,70,78],borderColor:GREEN,backgroundColor:'rgba(22,163,74,0.1)',fill:true,tension:0.4},
      {label:'Absent',data:[10,8,12,7,9,11,8],borderColor:RED,backgroundColor:'rgba(239,68,68,0.1)',fill:true,tension:0.4},
      {label:'On Leave',data:[5,4,6,3,5,9,4],borderColor:YELLOW,backgroundColor:'rgba(234,179,8,0.1)',fill:true,tension:0.4}
    ]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom'}}}}},
    {title:'Patient Footfall - Top 8 PHCs',config:{type:'bar',data:{labels:phcNames,datasets:[
      {label:'Patients Waiting',data:phcWaiting,backgroundColor:BLUE,borderRadius:4},
      {label:'Avg Wait Time (min)',data:phcWaitTime,backgroundColor:TEAL,borderRadius:4}
    ]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom'}}}}},
    {title:'Medicine Stock Status',config:{type:'doughnut',data:{labels:['Available','Low Stock','Out of Stock','Near Expiry','Expired'],datasets:[{data:[medStat.available,medStat.low,medStat.out,medStat.near,medStat.exp],backgroundColor:[GREEN,ORANGE,RED,YELLOW,'rgba(239,68,68,0.5)'],borderWidth:2,borderColor:'white'}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom'}}}}},
    {title:'Doctor Availability by Specialization',config:{type:'bar',data:{labels:specs.map(function(s){return s.length>12?s.slice(0,12)+'..':s;}),datasets:[
      {label:'Available',data:specAvail,backgroundColor:GREEN,borderRadius:4},
      {label:'Absent/Leave',data:specAbsent,backgroundColor:RED,borderRadius:4}
    ]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom'}},scales:{x:{stacked:false},y:{stacked:false}}}}},
    {title:'PHC Workload (Patients Waiting)',config:{type:'bar',data:{labels:phcNames,datasets:[{label:'Patients Waiting',data:phcWaiting,backgroundColor:phcWaiting.map(function(v){return v>60?RED:v>35?ORANGE:GREEN;}),borderRadius:4}]},options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}}}}},
    {title:'Average Waiting Time by PHC (min)',config:{type:'line',data:{labels:phcNames,datasets:[
      {label:'Avg Wait (min)',data:phcWaitTime,borderColor:TEAL,backgroundColor:'rgba(13,148,136,0.1)',fill:true,tension:0.4,pointBackgroundColor:phcWaitTime.map(function(v){return v>45?'#ef4444':v>20?'#f97316':'#16a34a';})},
      {label:'Normal Threshold (20 min)',data:phcNames.map(function(){return 20;}),borderColor:'rgba(22,163,74,0.5)',borderDash:[5,5],fill:false},
      {label:'Critical Threshold (45 min)',data:phcNames.map(function(){return 45;}),borderColor:'rgba(239,68,68,0.5)',borderDash:[5,5],fill:false}
    ]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom'}}}}}
  ];

  return h('div',{className:'space-y-6'},
    h('div',{className:'flex items-center justify-between flex-wrap gap-3'},
      h('div',{},h('h1',{className:'text-xl font-bold text-gray-900'},'Reports & Analytics'),h('p',{className:'text-gray-500 text-sm'},'District-wide health performance metrics')),
      h('div',{className:'flex gap-2'},
        h('button',{onClick:function(){alert('PDF export ready for backend integration.');},className:'flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200'},Dw&&h(Dw,{size:14}),'PDF'),
        h('button',{onClick:function(){alert('CSV export ready for backend integration.');},className:'flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200'},Dw&&h(Dw,{size:14}),'CSV')
      )
    ),
    h('div',{className:'flex gap-1 bg-gray-100 p-1 rounded-xl w-fit'},
      ['daily','weekly','monthly','custom'].map(function(p){
        return h('button',{key:p,onClick:function(){setPeriod(p);},
          className:'px-4 py-1.5 rounded-lg text-sm font-medium transition-all '+(period===p?'bg-white text-blue-700 shadow-sm':'text-gray-500 hover:text-gray-700')},p.charAt(0).toUpperCase()+p.slice(1));
      })
    ),
    h('div',{className:'grid lg:grid-cols-2 gap-5'},
      charts.map(function(c,i){return h(ChartCard,{key:i,title:c.title,config:c.config});})
    ),
    h('div',{className:'p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-700'},
      h('strong',{},'Data note: '),'Charts display current snapshot data. Connect to backend API for real-time historical analytics and trend analysis.'
    )
  );
};

console.log('[SmartPHC] Reports loaded.');
})();
