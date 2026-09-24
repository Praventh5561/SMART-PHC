
// staff-dashboard.js - PHC Staff Dashboard
(function(){
var R=React; var h=R.createElement; var icons=window.lucideReact||{};

window.StaffDashboard=function StaffDashboard(){
  var ctx=R.useContext(window.AppContext);
  var state=ctx.state; var dispatch=ctx.dispatch;
  var user=state.currentUser||{};
  var phcId=user.phcId||'PHC001';
  var phc=state.phcs.find(function(p){return p.id===phcId;})||{name:'--',patientsWaiting:0,avgWaitingTime:0};
  var doctors=state.doctors.filter(function(d){return d.homePhcId===phcId;});
  var medicines=state.medicines.filter(function(m){return m.phcId===phcId;});
  var queue=state.queues[phcId]||{tokens:[],serving:0};
  var alerts=medicines.filter(function(m){return m.status!=='available';});
  var wc=window.waitColor(phc.avgWaitingTime);
  var absentDocs=doctors.filter(function(d){return d.status==='absent';});

  var Us=icons.Users; var AT=icons.AlertTriangle; var Pill=icons.Pill; var UP=icons.UserPlus;
  var Clk=icons.Clock; var ChR=icons.ChevronRight;

  return h('div',{className:'space-y-6'},
    h('div',{className:'flex flex-col sm:flex-row sm:items-center justify-between gap-3'},
      h('div',{},
        h('h1',{className:'text-2xl font-bold text-gray-900'},phc.name),
        h('p',{className:'text-gray-500 text-sm'},'Staff Dashboard · 22 September 2026')
      ),
      h('div',{className:'flex gap-2'},
        h('button',{onClick:function(){dispatch({type:'NAVIGATE',page:'staff/registration'});},
          className:'flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700'},UP&&h(UP,{size:16}),'Register Patient'),
        h('button',{onClick:function(){dispatch({type:'NAVIGATE',page:'staff/queue'});},
          className:'flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700'},icons.Tv2&&h(icons.Tv2,{size:16}),'Queue Display')
      )
    ),
    absentDocs.length>0&&h('div',{className:'bg-red-50 border border-red-200 rounded-xl p-4'},
      h('div',{className:'flex items-center gap-2 mb-2'},AT&&h(AT,{size:18,className:'text-red-600'}),h('p',{className:'font-semibold text-red-900'},'Doctor Absence Alert')),
      absentDocs.map(function(d){
        return h('div',{key:d.id,className:'flex items-center justify-between mt-2'},
          h('div',{},h('p',{className:'text-red-800 text-sm font-medium'},d.name+' — '+d.specialization),h('p',{className:'text-red-600 text-xs'},'Reason: '+(d.leaveReason||'Not reported'))),
          h('button',{onClick:function(){dispatch({type:'NAVIGATE',page:'staff/attendance'});},className:'text-xs text-blue-600 hover:underline font-medium'},'Manage')
        );
      })
    ),
    h('div',{className:'grid sm:grid-cols-2 lg:grid-cols-4 gap-4'},
      h(window.KPICard,{title:'Patients Waiting',value:phc.patientsWaiting,icon:Us,color:'teal'}),
      h(window.KPICard,{title:'Avg Wait Time',value:phc.avgWaitingTime+' min',icon:Clk,color:phc.avgWaitingTime>45?'red':'green'}),
      h(window.KPICard,{title:'Doctors On Duty',value:phc.doctorsOnDuty+'/'+phc.doctorsAssigned,icon:icons.Stethoscope,color:'blue'}),
      h(window.KPICard,{title:'Medicine Alerts',value:alerts.length,icon:Pill,color:alerts.length>0?'orange':'green'})
    ),
    h('div',{className:'grid lg:grid-cols-3 gap-5'},
      h('div',{className:'lg:col-span-2 space-y-4'},
        h(window.Card,{className:'p-5'},
          h('div',{className:'flex items-center justify-between mb-4'},
            h('h3',{className:'font-semibold text-gray-900'},'Doctor Status'),
            h('button',{onClick:function(){dispatch({type:'NAVIGATE',page:'staff/attendance'});},className:'text-blue-600 hover:underline text-sm'},'Manage →')
          ),
          h('div',{className:'space-y-2'},
            doctors.map(function(d){
              return h('div',{key:d.id,className:'flex items-center justify-between p-3 bg-gray-50 rounded-xl'},
                h('div',{className:'flex items-center gap-3'},
                  h('div',{className:'w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-700'},d.name.split(' ').slice(-1)[0][0]),
                  h('div',{},h('p',{className:'font-medium text-gray-900 text-sm'},d.name),h('p',{className:'text-xs text-gray-400'},d.specialization))
                ),
                h('div',{className:'flex items-center gap-3'},
                  d.checkInTime&&h('p',{className:'text-xs text-gray-400'},'In: '+d.checkInTime),
                  h(window.Badge,{status:d.status},d.status),
                  d.status==='available'&&h('button',{onClick:function(){dispatch({type:'MARK_ABSENT',doctorId:d.id,reason:'Reported absent by staff'});},
                    className:'text-xs text-red-600 hover:text-red-700 hover:underline'},'Mark Absent')
                )
              );
            })
          )
        ),
        alerts.length>0&&h(window.Card,{className:'p-5'},
          h('div',{className:'flex items-center gap-2 mb-3'},AT&&h(AT,{size:16,className:'text-orange-500'}),h('h3',{className:'font-semibold text-gray-900'},'Medicine Alerts')),
          h('div',{className:'space-y-2'},
            alerts.slice(0,4).map(function(m){
              return h('div',{key:m.id,className:'flex items-center justify-between p-3 bg-orange-50 rounded-xl border border-orange-100'},
                h('div',{},h('p',{className:'font-medium text-gray-900 text-sm'},m.name),h('p',{className:'text-xs text-gray-400'},'Qty: '+m.quantity+' (min: '+m.minStock+') · '+m.expiryDate)),
                h(window.Badge,{status:m.status},m.status.replace(/-/g,' ').replace(/\b\w/g,function(c){return c.toUpperCase();}))
              );
            }),
            alerts.length>4&&h('p',{className:'text-xs text-gray-400 text-center mt-1'},'+' +(alerts.length-4)+' more alerts')
          )
        )
      ),
      h('div',{className:'space-y-4'},
        h(window.Card,{className:'p-5'},
          h('div',{className:'flex items-center justify-between mb-3'},h('h3',{className:'font-semibold text-gray-900'},'Live Queue'),h(window.Badge,{status:phc.status||'normal'},phc.status||'Normal')),
          h('div',{className:'text-center py-4'},
            h('p',{className:'text-xs text-gray-400 mb-1'},'Now Serving'),
            h('div',{className:'token-display text-3xl'},'A'+String(queue.serving||0).padStart(3,'0'))
          ),
          h('div',{className:'flex justify-between text-sm mt-3'},
            h('div',{className:'text-center'},h('p',{className:'text-lg font-bold text-gray-900'},queue.tokens.length),h('p',{className:'text-xs text-gray-400'},'Waiting')),
            h('div',{className:'text-center'},h('p',{className:'text-lg font-bold '+wc.text},phc.avgWaitingTime+'m'),h('p',{className:'text-xs text-gray-400'},'Avg Wait'))
          ),
          h('button',{onClick:function(){dispatch({type:'CALL_NEXT_TOKEN',phcId:phcId});},
            disabled:queue.tokens.length===0,
            className:'w-full mt-3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold disabled:opacity-40 transition-colors'},
            'Call Next Token')
        ),
        h(window.Card,{className:'p-5'},
          h('h3',{className:'font-semibold text-gray-900 mb-3'},'Quick Links'),
          h('div',{className:'space-y-2'},
            [{l:'New Patient Registration',p:'staff/registration',ic:'UserPlus'},{l:'QR Scanner',p:'staff/scanner',ic:'QrCode'},{l:'Medicine Inventory',p:'staff/medicine',ic:'Pill'},{l:'Generate Report',p:'staff/reports',ic:'BarChart3'}].map(function(item){
              var IC=icons[item.ic];
              return h('button',{key:item.p,onClick:function(){dispatch({type:'NAVIGATE',page:item.p});},
                className:'w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 font-medium transition-colors text-left'},
                IC&&h(IC,{size:15,className:'text-blue-600'}),item.l
              );
            })
          )
        )
      )
    )
  );
};

console.log('[SmartPHC] Staff dashboard loaded.');
})();
