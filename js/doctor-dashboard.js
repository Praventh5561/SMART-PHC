
// doctor-dashboard.js - Doctor Dashboard, Queue, History
(function(){
var R=React; var h=R.createElement; var icons=window.lucideReact||{};

window.DoctorDashboard=function DoctorDashboard(){
  var ctx=R.useContext(window.AppContext);
  var state=ctx.state; var dispatch=ctx.dispatch;
  var user=state.currentUser||{};
  var doctor=state.doctors.find(function(d){return d.id===user.id;})||
    state.doctors.find(function(d){return d.homePhcId===user.phcId;})||state.doctors[1]||{};
  var phc=state.phcs.find(function(p){return p.id===doctor.currentPhcId;})||{name:'--',patientsWaiting:0,avgWaitingTime:0};
  var homePhc=state.phcs.find(function(p){return p.id===doctor.homePhcId;})||{name:'--'};
  var queue=state.queues[doctor.currentPhcId]||{tokens:[],serving:0,currentToken:0};
  var wc=window.waitColor(phc.avgWaitingTime||0);
  var CkI=icons.CheckCircle; var CkO=icons.LogOut; var Us=icons.Users; var Clk=icons.Clock;
  var ArR=icons.ArrowRightLeft||icons.ArrowRight;

  return h('div',{className:'space-y-6'},
    h('div',{className:'flex flex-col sm:flex-row sm:items-center justify-between gap-3'},
      h('div',{},
        h('h1',{className:'text-2xl font-bold text-gray-900'},'Good morning, '+doctor.name),
        h('p',{className:'text-gray-500 text-sm'},'22 September 2026 · '+doctor.specialization)
      ),
      h('div',{className:'flex gap-2'},
        doctor.status!=='available'?
          h('button',{onClick:function(){dispatch({type:'CHECK_IN',doctorId:doctor.id});},
            className:'flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors'},
            CkI&&h(CkI,{size:16}),'Check In'):
          h('button',{onClick:function(){dispatch({type:'CHECK_OUT',doctorId:doctor.id});},
            className:'flex items-center gap-2 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-300 transition-colors'},
            CkO&&h(CkO,{size:16}),'Check Out')
      )
    ),
    doctor.isTemporarilyAssigned&&h('div',{className:'bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-center gap-3'},
      ArR&&h(ArR,{size:18,className:'text-purple-600 flex-shrink-0'}),
      h('div',{},
        h('p',{className:'font-semibold text-purple-900'},'Temporary Assignment Active'),
        h('p',{className:'text-purple-700 text-sm'},'Assigned to '+phc.name+'. Your home PHC: '+homePhc.name)
      )
    ),
    h('div',{className:'grid sm:grid-cols-2 lg:grid-cols-4 gap-4'},
      h(window.KPICard,{title:'Patients Served Today',value:doctor.patientsServedToday||0,icon:icons.UserCheck||Us,color:'blue'}),
      h(window.KPICard,{title:'Waiting Now',value:phc.patientsWaiting||0,icon:Us,color:'teal'}),
      h(window.KPICard,{title:'Avg Wait Time',value:(phc.avgWaitingTime||0)+' min',icon:Clk,color:phc.avgWaitingTime>45?'red':'green'}),
      h(window.KPICard,{title:'Consultation Time',value:(doctor.avgConsultationTime||10)+' min',icon:icons.Stethoscope,color:'purple'})
    ),
    h('div',{className:'grid lg:grid-cols-3 gap-5'},
      h('div',{className:'lg:col-span-2'},
        h(window.Card,{className:'p-5'},
          h('div',{className:'flex items-center justify-between mb-4'},
            h('h3',{className:'font-semibold text-gray-900'},"Today's Queue"),
            h('div',{className:'flex items-center gap-2'},
              h('span',{className:'text-sm text-gray-500'},'Now serving:'),
              h('span',{className:'font-bold text-blue-700 text-lg'},'A'+String(queue.serving||0).padStart(3,'0'))
            )
          ),
          queue.tokens.length===0?
            h('div',{className:'text-center py-10'},
              Us&&h(Us,{size:32,className:'mx-auto text-gray-300 mb-3'}),
              h('p',{className:'text-gray-400'},'No patients in queue')
            ):
            h('div',{className:'space-y-2'},
              queue.tokens.slice(0,6).map(function(tok,i){
                return h('div',{key:tok,className:'flex items-center justify-between p-3 '+(i===0?'bg-blue-50 border border-blue-200':'bg-gray-50')+' rounded-xl'},
                  h('div',{className:'flex items-center gap-3'},
                    h('div',{className:'w-12 h-12 rounded-xl '+(i===0?'bg-blue-600 text-white':'bg-white border border-gray-200 text-gray-600')+' flex items-center justify-center font-black text-base shadow-sm'},
                      'A'+String(tok).padStart(3,'0')),
                    h('div',{},
                      h('p',{className:'font-medium text-gray-900 text-sm'},'Token A'+String(tok).padStart(3,'0')),
                      h('p',{className:'text-xs text-gray-400'},i===0?'Next — Waiting outside':('Position '+(i+1)+' in queue'))
                    )
                  ),
                  i===0&&h('div',{className:'flex gap-2'},
                    h('button',{className:'px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700'},'Start Consult'),
                    h('button',{onClick:function(){dispatch({type:'CALL_NEXT_TOKEN',phcId:doctor.currentPhcId});},
                      className:'px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700'},'Mark Done')
                  )
                );
              })
            )
        )
      ),
      h('div',{className:'space-y-4'},
        h(window.Card,{className:'p-5'},
          h('h3',{className:'font-semibold text-gray-900 mb-3'},'My Attendance'),
          h('div',{className:'space-y-3 text-sm'},
            h('div',{className:'flex justify-between items-center'},h('span',{className:'text-gray-500'},'Status'),h(window.Badge,{status:doctor.status},doctor.status)),
            h('div',{className:'flex justify-between'},h('span',{className:'text-gray-500'},'Check-in'),h('span',{className:'font-medium'},doctor.checkInTime||'Not checked in')),
            h('div',{className:'flex justify-between'},h('span',{className:'text-gray-500'},'Current PHC'),h('span',{className:'font-medium text-xs text-right'},phc.name))
          )
        ),
        h(window.Card,{className:'p-5'},
          h('h3',{className:'font-semibold text-gray-900 mb-3'},'Quick Actions'),
          h('div',{className:'space-y-2'},
            [{l:'Patient Queue',p:'doctor/queue',ic:'Users'},{l:'Patient History',p:'doctor/history',ic:'History'},{l:'Medicine Info',p:'doctor/medicine',ic:'Pill'},{l:'My Assignments',p:'doctor/assignments',ic:'ArrowRightLeft'}].map(function(item){
              var IC=icons[item.ic];
              return h('button',{key:item.p,onClick:function(){dispatch({type:'NAVIGATE',page:item.p});},
                className:'w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition-colors text-left'},
                h('div',{className:'w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0'},IC&&h(IC,{size:15,className:'text-blue-600'})),
                item.l
              );
            })
          )
        ),
        h(window.Card,{className:'p-4'},
          h('div',{className:'flex items-center gap-2 mb-2'},icons.AlertTriangle&&h(icons.AlertTriangle,{size:14,className:'text-orange-500'}),h('p',{className:'text-xs font-semibold text-gray-700'},'PHC Status')),
          h('div',{className:'text-center py-2'},
            h('p',{className:'text-3xl font-black '+wc.text},phc.patientsWaiting),
            h('p',{className:'text-xs text-gray-400 mt-0.5'},'patients waiting'),
            h('p',{className:'text-sm font-semibold '+wc.text+' mt-1'},phc.avgWaitingTime+' min avg wait')
          )
        )
      )
    )
  );
};

window.DoctorQueuePage=function DoctorQueuePage(){
  var ctx=R.useContext(window.AppContext);
  var state=ctx.state; var dispatch=ctx.dispatch;
  var user=state.currentUser||{};
  var doctor=state.doctors.find(function(d){return d.id===user.id;})||state.doctors[1]||{};
  var queue=state.queues[doctor.currentPhcId]||{tokens:[],serving:0};
  return h('div',{className:'space-y-5 max-w-2xl'},
    h('h1',{className:'text-xl font-bold text-gray-900'},'Patient Queue Management'),
    h(window.Card,{className:'p-6 text-center'},
      h('p',{className:'text-gray-400 text-sm font-medium uppercase tracking-wider mb-3'},'Now Serving'),
      h('div',{className:'token-display mb-4'},'A'+String(queue.serving||0).padStart(3,'0')),
      h('div',{className:'flex gap-3 justify-center'},
        h('button',{onClick:function(){dispatch({type:'CALL_NEXT_TOKEN',phcId:doctor.currentPhcId});},
          disabled:queue.tokens.length===0,
          className:'flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors'},
          icons.ChevronRight&&h(icons.ChevronRight,{size:18}),'Call Next Patient')
      )
    ),
    queue.tokens.length>0&&h(window.Card,{className:'p-5'},
      h('p',{className:'font-semibold text-gray-800 mb-3'},'Next in Queue ('+queue.tokens.length+' waiting)'),
      h('div',{className:'grid grid-cols-5 gap-2'},
        queue.tokens.slice(0,10).map(function(t,i){
          return h('div',{key:t,className:'aspect-square '+(i===0?'bg-blue-600 text-white':'bg-gray-100 text-gray-700')+' rounded-xl flex items-center justify-center font-bold text-sm'},
            'A'+String(t).padStart(3,'0'));
        })
      )
    )
  );
};

window.DoctorHistoryPage=function DoctorHistoryPage(){
  var ctx=R.useContext(window.AppContext);
  var state=ctx.state;
  var user=state.currentUser||{};
  var doctor=state.doctors.find(function(d){return d.id===user.id;})||{id:'DOC002'};
  var visits=[];
  state.patients.forEach(function(p){
    (p.visitHistory||[]).forEach(function(v){
      if(v.doctorId===doctor.id)visits.push(Object.assign({},v,{patientName:p.name,patientId:p.id}));
    });
  });
  return h('div',{className:'space-y-5'},
    h('h1',{className:'text-xl font-bold text-gray-900'},'Patient History'),
    h('p',{className:'text-gray-500 text-sm'},visits.length+' records found'),
    h('div',{className:'overflow-x-auto bg-white rounded-xl border border-gray-100 shadow-sm'},
      h('table',{className:'w-full text-sm'},
        h('thead',{},h('tr',{className:'bg-gray-50 border-b border-gray-200'},
          ['Date','Patient ID','Patient Name','Diagnosis','Prescription','Token'].map(function(c){return h('th',{key:c,className:'text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide'},c);})
        )),
        h('tbody',{},visits.length?visits.map(function(v,i){
          return h('tr',{key:i,className:'border-b border-gray-100 hover:bg-gray-50'},
            h('td',{className:'px-4 py-3 text-gray-600'},v.date),
            h('td',{className:'px-4 py-3 font-mono text-xs text-blue-700'},v.patientId),
            h('td',{className:'px-4 py-3 font-medium text-gray-900'},v.patientName),
            h('td',{className:'px-4 py-3 text-gray-700'},v.diagnosis),
            h('td',{className:'px-4 py-3 text-gray-400 text-xs'},v.prescription),
            h('td',{className:'px-4 py-3 text-gray-600'},v.token)
          );
        }):[h('tr',{key:'empty'},h('td',{colSpan:6,className:'px-4 py-10 text-center text-gray-400'},'No patient history found for your account.'))])
      )
    )
  );
};

window.DoctorAssignmentsPage=function DoctorAssignmentsPage(){
  var ctx=R.useContext(window.AppContext);
  var state=ctx.state;
  var user=state.currentUser||{};
  var doctor=state.doctors.find(function(d){return d.id===user.id;})||{id:'DOC002'};
  var myAssignments=state.assignments.filter(function(a){return a.doctorId===doctor.id;});
  return h('div',{className:'space-y-5 max-w-2xl'},
    h('h1',{className:'text-xl font-bold text-gray-900'},'My Assignments'),
    myAssignments.length===0?h(window.Card,{className:'p-10 text-center'},h('p',{className:'text-gray-400'},'No active or past assignments.')):
    h('div',{className:'space-y-3'},
      myAssignments.map(function(a){
        var toPhc=state.phcs.find(function(p){return p.id===a.toPhcId;})||{name:a.toPhcId};
        var fromPhc=state.phcs.find(function(p){return p.id===a.fromPhcId;})||{name:a.fromPhcId};
        return h(window.Card,{key:a.id,className:'p-5'},
          h('div',{className:'flex items-start justify-between mb-3'},
            h('div',{},h('p',{className:'font-semibold text-gray-900'},fromPhc.name+' → '+toPhc.name),h('p',{className:'text-xs text-gray-400 mt-0.5'},'Date: '+a.date+' · From: '+a.startTime)),
            h(window.Badge,{status:a.status==='active'?'available':'moderate'},a.status)
          ),
          h('div',{className:'grid grid-cols-3 gap-3 text-sm'},
            h('div',{},h('p',{className:'text-xs text-gray-400'},'AI Score'),h('p',{className:'font-bold text-blue-700'},a.aiScore?a.aiScore.toFixed(3):'--')),
            h('div',{},h('p',{className:'text-xs text-gray-400'},'Approved By'),h('p',{className:'font-medium text-gray-900 text-xs'},a.approvedBy||'--')),
            h('div',{},h('p',{className:'text-xs text-gray-400'},'Reason'),h('p',{className:'font-medium text-gray-900 text-xs'},a.reason||'--'))
          )
        );
      })
    )
  );
};

console.log('[SmartPHC] Doctor dashboard loaded.');
})();
