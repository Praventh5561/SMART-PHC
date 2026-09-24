
// patient-dashboard.js - Patient Dashboard (mobile-first)
(function(){
var R=React; var h=R.createElement; var icons=window.lucideReact||{};

window.PatientDashboard=function PatientDashboard(){
  var ctx=R.useContext(window.AppContext);
  var state=ctx.state; var dispatch=ctx.dispatch;
  var user=state.currentUser||{};
  var patient=state.patients.find(function(p){return p.id===user.patientId;})||
    state.patients.find(function(p){return p.registeredPhcId===user.phcId;})||state.patients[0]||{};
  var phc=state.phcs.find(function(p){return p.id===(patient.registeredPhcId||user.phcId);})||{name:'--',patientsWaiting:0,avgWaitingTime:0};
  var queue=state.queues[phc.id]||{tokens:[],serving:0};
  var doctors=state.doctors.filter(function(d){return d.currentPhcId===phc.id&&d.status==='available';});
  var wc=window.waitColor(phc.avgWaitingTime);

  return h('div',{className:'space-y-5 max-w-2xl mx-auto'},
    h('div',{className:'bg-gradient-to-r from-blue-700 to-teal-600 text-white rounded-2xl p-6'},
      h('div',{className:'flex items-start justify-between'},
        h('div',{},
          h('p',{className:'text-blue-200 text-sm mb-1'},'Welcome back'),
          h('h1',{className:'text-2xl font-bold'},(user.name||patient.name||'Patient')),
          h('p',{className:'text-blue-200 text-sm mt-1'},phc.name)
        ),
        h('div',{className:'flex-shrink-0'},
          h(window.QRDisplay,{patientId:patient.id||user.patientId||'SPHC-2026-00001',size:80})
        )
      ),
      h('div',{className:'mt-4 bg-white/10 rounded-xl p-3 flex items-center justify-between'},
        h('div',{},h('p',{className:'text-blue-200 text-xs'},'Your Patient ID'),h('p',{className:'font-mono font-bold text-base'},(patient.id||user.patientId||'SPHC-2026-00001'))),
        h('div',{className:'text-right'},h('p',{className:'text-blue-200 text-xs'},'Registered PHC'),h('p',{className:'font-semibold text-sm'},phc.name))
      )
    ),
    h('div',{className:'grid grid-cols-3 gap-3'},
      h(window.Card,{className:'p-4 text-center'},
        h('p',{className:'text-2xl font-bold '+wc.text},phc.patientsWaiting),
        h('p',{className:'text-xs text-gray-500 mt-1'},'Waiting Now')
      ),
      h(window.Card,{className:'p-4 text-center'},
        h('p',{className:'text-2xl font-bold '+wc.text},phc.avgWaitingTime+'m'),
        h('p',{className:'text-xs text-gray-500 mt-1'},'Avg Wait')
      ),
      h(window.Card,{className:'p-4 text-center'},
        h('p',{className:'text-2xl font-bold text-blue-700'},doctors.length),
        h('p',{className:'text-xs text-gray-500 mt-1'},'Doctors On Duty')
      )
    ),
    h(window.Card,{className:'p-5'},
      h('div',{className:'flex items-center justify-between mb-4'},
        h('h3',{className:'font-semibold text-gray-900'},'Current Queue Status'),
        h(window.Badge,{status:phc.status||'normal'},phc.status||'Normal')
      ),
      h('div',{className:'text-center py-4 bg-gray-50 rounded-xl'},
        h('p',{className:'text-xs text-gray-400 mb-1 uppercase tracking-wide'},'Now Serving'),
        h('div',{className:'token-display mb-1'},'A'+String(queue.serving||0).padStart(3,'0')),
        h('p',{className:'text-gray-400 text-sm'},'Next: A'+String((queue.tokens[0])||0).padStart(3,'0'))
      ),
      h('p',{className:'text-center text-xs text-gray-400 mt-3'},'Take a token at the reception when you arrive')
    ),
    doctors.length>0&&h(window.Card,{className:'p-5'},
      h('h3',{className:'font-semibold text-gray-900 mb-3'},'Doctors On Duty Today'),
      h('div',{className:'space-y-2'},
        doctors.slice(0,3).map(function(d){
          return h('div',{key:d.id,className:'flex items-center justify-between p-3 bg-gray-50 rounded-xl'},
            h('div',{className:'flex items-center gap-3'},
              h('div',{className:'w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm'},d.name.charAt(d.name.lastIndexOf(' ')+1)),
              h('div',{},h('p',{className:'font-medium text-gray-900 text-sm'},d.name),h('p',{className:'text-xs text-gray-400'},d.specialization))
            ),
            h('div',{className:'text-right'},h(window.Badge,{status:'available'},'Available'),d.checkInTime&&h('p',{className:'text-xs text-gray-400 mt-0.5'},'Since '+d.checkInTime))
          );
        })
      )
    ),
    patient.visitHistory&&patient.visitHistory.length>0&&h(window.Card,{className:'p-5'},
      h('div',{className:'flex items-center justify-between mb-3'},
        h('h3',{className:'font-semibold text-gray-900'},'Recent Visits'),
        h('button',{onClick:function(){dispatch({type:'NAVIGATE',page:'patient/history'});},className:'text-blue-600 hover:underline text-sm'},'View all')
      ),
      h('div',{className:'space-y-2'},
        patient.visitHistory.slice(0,2).map(function(v,i){
          var vPhc=state.phcs.find(function(p){return p.id===v.phcId;})||{name:v.phcId};
          return h('div',{key:i,className:'p-3 bg-gray-50 rounded-xl border border-gray-100'},
            h('div',{className:'flex justify-between mb-1'},
              h('span',{className:'font-medium text-gray-900 text-sm'},v.date),
              h('span',{className:'text-xs text-gray-400'},vPhc.name)
            ),
            h('p',{className:'text-sm text-gray-700'},v.diagnosis),
            h('p',{className:'text-xs text-gray-400 mt-0.5'},'Rx: '+v.prescription)
          );
        })
      )
    ),
    h(window.Card,{className:'p-5'},
      h('h3',{className:'font-semibold text-gray-900 mb-3'},'Quick Links'),
      h('div',{className:'grid grid-cols-2 gap-3'},
        [{l:'My QR Code',p:'patient/qr',ic:'QrCode',c:'bg-blue-600'},{l:'My Token',p:'patient/token',ic:'Ticket',c:'bg-teal-600'},{l:'Visit History',p:'patient/history',ic:'History',c:'bg-green-600'},{l:'My Profile',p:'patient/profile',ic:'User',c:'bg-purple-600'}].map(function(item){
          var IC=icons[item.ic];
          return h('button',{key:item.p,onClick:function(){dispatch({type:'NAVIGATE',page:item.p});},
            className:'flex flex-col items-center gap-2 p-4 '+item.c+' text-white rounded-xl hover:opacity-90 transition-opacity'},
            IC&&h(IC,{size:20}),h('span',{className:'text-xs font-medium'},item.l)
          );
        })
      )
    )
  );
};

window.PatientQRPage=function PatientQRPage(){
  var ctx=R.useContext(window.AppContext);
  var state=ctx.state;
  var user=state.currentUser||{};
  var patient=state.patients.find(function(p){return p.id===user.patientId;})||state.patients[0]||{};
  var pid=patient.id||user.patientId||'SPHC-2026-00001';
  return h('div',{className:'max-w-sm mx-auto text-center py-8 space-y-5'},
    h('h1',{className:'text-xl font-bold text-gray-900'},'Your Patient QR Code'),
    h('p',{className:'text-gray-500 text-sm'},'Show this at the PHC reception for quick registration'),
    h(window.Card,{className:'p-8'},h(window.QRDisplay,{patientId:pid,size:180})),
    h('p',{className:'text-xs text-gray-400'},'QR code contains Patient ID only. No medical information is stored in the code.'),
    h('button',{onClick:function(){window.print();},className:'flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium mx-auto'},icons.Printer&&h(icons.Printer,{size:16}),'Print / Save')
  );
};

window.PatientHistoryPage=function PatientHistoryPage(){
  var ctx=R.useContext(window.AppContext);
  var state=ctx.state;
  var user=state.currentUser||{};
  var patient=state.patients.find(function(p){return p.id===user.patientId;})||state.patients[0]||{};
  return h('div',{className:'space-y-5 max-w-2xl'},
    h('h1',{className:'text-xl font-bold text-gray-900'},'Visit History'),
    h('p',{className:'text-gray-500 text-sm'},patient.name+' · '+(patient.visitHistory||[]).length+' visits'),
    (patient.visitHistory||[]).length===0?h(window.Card,{className:'p-10 text-center'},h('p',{className:'text-gray-400'},'No visit history yet.')):
    h('div',{className:'space-y-3'},
      (patient.visitHistory||[]).map(function(v,i){
        var vPhc=state.phcs.find(function(p){return p.id===v.phcId;})||{name:v.phcId};
        return h(window.Card,{key:i,className:'p-5'},
          h('div',{className:'flex items-start justify-between mb-3'},
            h('div',{},h('p',{className:'font-semibold text-gray-900'},v.date),h('p',{className:'text-sm text-gray-500'},vPhc.name)),
            h('span',{className:'text-xs font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded-lg'},'Token: '+v.token)
          ),
          h('div',{className:'space-y-2 text-sm'},
            h('div',{},h('span',{className:'text-xs font-medium text-gray-400 uppercase'},'Diagnosis '),h('span',{className:'text-gray-800'},v.diagnosis)),
            h('div',{},h('span',{className:'text-xs font-medium text-gray-400 uppercase'},'Prescription '),h('span',{className:'text-gray-600'},v.prescription))
          )
        );
      })
    )
  );
};

console.log('[SmartPHC] Patient dashboard loaded.');
})();
