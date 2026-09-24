
// ddhs.js - DDHS Dashboard, AI Recommendation, PHC Management, Attendance, Audit
(function(){
var R=React; var h=R.createElement; var icons=window.lucideReact||{};

function calcScore(doc,absentDoc,phcs,weights){
  var w=weights||{specialization:40,distance:30,patientLoad:30};
  var specScore=doc.specialization===absentDoc.specialization?1.0:
    (doc.specialization==='General Medicine'||absentDoc.specialization==='General Medicine')?0.5:0;
  var docPhc=phcs.find(function(p){return p.id===doc.homePhcId;})||{distanceFromHQ:50};
  var absPhc=phcs.find(function(p){return p.id===absentDoc.homePhcId;})||{distanceFromHQ:10};
  var dist=Math.abs(docPhc.distanceFromHQ-absPhc.distanceFromHQ);
  var distScore=Math.max(0,1-(dist/50));
  var loadScore=Math.max(0,1-(doc.patientsServedToday/30));
  var score=((w.specialization/100)*specScore)+((w.distance/100)*distScore)+((w.patientLoad/100)*loadScore);
  return{score:parseFloat(score.toFixed(3)),specScore:parseFloat(specScore.toFixed(2)),
    distScore:parseFloat(distScore.toFixed(2)),loadScore:parseFloat(loadScore.toFixed(2)),dist:Math.round(dist)};
}

// ── DDHS Dashboard ──────────────────────────────────────────
window.DDHSDashboard=function DDHSDashboard(){
  var ctx=R.useContext(window.AppContext);
  var state=ctx.state; var dispatch=ctx.dispatch;
  var phcs=state.phcs; var doctors=state.doctors; var medicines=state.medicines;
  var B2=icons.Building2; var Steth=icons.Stethoscope; var Us=icons.Users; var AT=icons.AlertTriangle;
  var Pill=icons.Pill; var UX=icons.UserX; var Act=icons.Activity; var Sp=icons.Sparkles;
  var onDuty=doctors.filter(function(d){return d.status==='available'||d.status==='delayed';}).length;
  var absent=doctors.filter(function(d){return d.status==='absent'||d.status==='on-leave';}).length;
  var totalWaiting=phcs.reduce(function(s,p){return s+p.patientsWaiting;},0);
  var critPHCs=phcs.filter(function(p){return p.status==='critical';}).length;
  var lowStock=medicines.filter(function(m){return m.status==='low-stock'||m.status==='out-of-stock';}).length;
  var activeAsgn=state.assignments.filter(function(a){return a.status==='active';}).length;
  var absDoctors=doctors.filter(function(d){return d.status==='absent'&&!d.isTemporarilyAssigned;});
  var sc=window.phcStatusColor;

  return h('div',{className:'space-y-6'},
    h('div',{className:'flex flex-col sm:flex-row sm:items-center justify-between gap-3'},
      h('div',{},
        h('h1',{className:'text-2xl font-bold text-gray-900'},'District Health Monitoring Dashboard'),
        h('p',{className:'text-gray-500 text-sm mt-0.5'},'Coimbatore District \u00b7 22 September 2026, Monday')
      ),
      h('div',{className:'flex items-center gap-2'},
        h(window.OfflineIndicator,{isOnline:state.isOnline}),
        h('button',{onClick:function(){dispatch({type:'NAVIGATE',page:'ddhs/reports'});},
          className:'flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors'},
          Act&&h(Act,{size:16}),'District Report')
      )
    ),
    h('div',{className:'grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3'},
      h(window.KPICard,{title:'Total PHCs',value:phcs.length,icon:B2,color:'blue'}),
      h(window.KPICard,{title:'On Duty',value:onDuty,icon:Steth,color:'green'}),
      h(window.KPICard,{title:'Absent',value:absent,icon:UX,color:'red',critical:absent>5}),
      h(window.KPICard,{title:'Patients Waiting',value:totalWaiting,icon:Us,color:'teal'}),
      h(window.KPICard,{title:'Critical PHCs',value:critPHCs,icon:AT,color:'red',critical:critPHCs>0}),
      h(window.KPICard,{title:'Low/Out Stock',value:lowStock,icon:Pill,color:'orange',critical:lowStock>10}),
      h(window.KPICard,{title:'Active Assignments',value:activeAsgn,icon:icons.ArrowRightLeft||icons.ArrowRight,color:'purple'})
    ),
    absDoctors.length>0&&h('div',{className:'bg-red-50 border border-red-200 rounded-xl p-5'},
      h('div',{className:'flex items-center gap-2 mb-4'},
        AT&&h(AT,{size:20,className:'text-red-600'}),
        h('h3',{className:'font-semibold text-red-900 text-lg'},'Doctor Absence Alerts'),
        h('span',{className:'ml-2 px-2.5 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-bold'},absDoctors.length)
      ),
      h('div',{className:'grid sm:grid-cols-2 lg:grid-cols-3 gap-3'},
        absDoctors.slice(0,6).map(function(doc){
          var phc=phcs.find(function(p){return p.id===doc.homePhcId;})||{name:'Unknown'};
          return h('div',{key:doc.id,className:'bg-white border border-red-200 rounded-xl p-4 shadow-sm'},
            h('div',{className:'flex items-start justify-between mb-2'},
              h('div',{},
                h('p',{className:'font-semibold text-gray-900 text-sm'},doc.name),
                h('p',{className:'text-xs text-gray-500'},doc.specialization)
              ),
              h(window.Badge,{status:'absent'},'Absent')
            ),
            h('p',{className:'text-xs text-gray-600 mb-1'},'PHC: '+phc.name),
            h('p',{className:'text-xs text-gray-500 mb-3'},'Reason: '+(doc.leaveReason||'Not reported')),
            h('button',{
              onClick:function(){dispatch({type:'SET_PENDING_ABSENT',doctorId:doc.id});dispatch({type:'NAVIGATE',page:'ddhs/ai-recommendations'});},
              className:'w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors'
            },Sp&&h(Sp,{size:13}),'Find Substitute Doctor')
          );
        })
      )
    ),
    h('div',{},
      h('div',{className:'flex items-center justify-between mb-4'},
        h('h3',{className:'text-lg font-semibold text-gray-900'},'PHC Status Overview'),
        h('div',{className:'flex items-center gap-4 text-xs'},
          [{s:'normal',label:'Normal'},{s:'moderate',label:'Moderate'},{s:'critical',label:'Critical'}].map(function(x){
            var c=sc(x.s);
            return h('span',{key:x.s,className:'flex items-center gap-1.5'},h('span',{className:'w-2.5 h-2.5 rounded-full '+c.dot}),x.label);
          })
        )
      ),
      h('div',{className:'grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4'},
        phcs.map(function(phc){
          var c=sc(phc.status);
          var wc=window.waitColor(phc.avgWaitingTime);
          return h(window.Card,{key:phc.id,
            className:'border-l-4 '+c.border+' p-4 phc-card-hover cursor-pointer',
            onClick:function(){dispatch({type:'NAVIGATE',page:'ddhs/phcs'});}
          },
            h('div',{className:'flex items-start justify-between mb-2'},
              h('div',{className:'flex-1 min-w-0'},
                h('p',{className:'font-semibold text-gray-900 text-sm truncate'},phc.name),
                h('p',{className:'text-xs text-gray-500 truncate'},phc.taluk)
              ),
              h(window.Badge,{status:phc.status},phc.status.charAt(0).toUpperCase()+phc.status.slice(1))
            ),
            h('div',{className:'grid grid-cols-2 gap-2 mt-3'},
              h('div',{className:'bg-gray-50 rounded-lg p-2 text-center'},
                h('p',{className:'text-xs text-gray-400 mb-0.5'},'Doctors'),
                h('p',{className:'font-bold text-gray-900 text-lg'},phc.doctorsOnDuty+'/'+phc.doctorsAssigned),
                phc.doctorsAbsent>0&&h('p',{className:'text-red-500 text-xs'},phc.doctorsAbsent+' absent')
              ),
              h('div',{className:'rounded-lg p-2 text-center '+wc.bg},
                h('p',{className:'text-xs text-gray-400 mb-0.5'},'Avg Wait'),
                h('p',{className:'font-bold text-lg '+wc.text},phc.avgWaitingTime+'m'),
                h('p',{className:'text-xs '+wc.text},phc.patientsWaiting+' waiting')
              )
            ),
            phc.medicineAlerts>0&&h('div',{className:'mt-2 flex items-center gap-1 text-orange-600 text-xs'},
              AT&&h(AT,{size:11}),phc.medicineAlerts+' medicine alert'+(phc.medicineAlerts>1?'s':'')
            )
          );
        })
      )
    )
  );
};

// ── AI Recommendation Page ────────────────────────────────────
window.AIRecommendationPage=function AIRecommendationPage(){
  var ctx=R.useContext(window.AppContext);
  var state=ctx.state; var dispatch=ctx.dispatch;
  var pendingId=state.aiPendingAbsent;
  var absentDoc=(pendingId&&state.doctors.find(function(d){return d.id===pendingId;}))||
    state.doctors.find(function(d){return d.status==='absent';})||{id:'',name:'Unknown',specialization:'',homePhcId:''};
  var absentPhc=state.phcs.find(function(p){return p.id===absentDoc.homePhcId;})||{name:'Unknown PHC',patientsWaiting:0,avgWaitingTime:0,location:''};
  var successState=R.useState(null); var success=successState[0]; var setSuccess=successState[1];
  var explainState=R.useState(false); var explain=explainState[0]; var setExplain=explainState[1];

  var candidates=state.doctors.filter(function(d){
    return d.status==='available'&&d.homePhcId!==absentDoc.homePhcId&&!d.isTemporarilyAssigned;
  });
  var ranked=candidates.map(function(d){
    return Object.assign({},d,calcScore(d,absentDoc,state.phcs,state.aiWeights));
  }).sort(function(a,b){return b.score-a.score;}).slice(0,5);

  var AT=icons.AlertTriangle; var Sp=icons.Sparkles; var Ck=icons.CheckCircle;
  var AL=icons.ArrowLeft; var Info=icons.Info;

  if(success){
    return h('div',{className:'max-w-lg mx-auto text-center py-16'},
      h('div',{className:'w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6'},
        Ck&&h(Ck,{size:40,className:'text-green-600'})),
      h('h2',{className:'text-2xl font-bold text-gray-900 mb-2'},'Assignment Approved!'),
      h('p',{className:'text-gray-600 mb-1'},success.name+' assigned to '+absentPhc.name),
      h('p',{className:'text-sm text-gray-500 mb-2'},'AI Score: '+success.score.toFixed(3)+' \u00b7 Notifications sent \u00b7 Audit log updated'),
      h('p',{className:'text-xs text-blue-700 bg-blue-50 rounded-xl p-3 mb-6'},'Queue at '+absentPhc.name+' should reduce by approx. 18-22% within 30 minutes.'),
      h('button',{onClick:function(){dispatch({type:'NAVIGATE',page:'ddhs/dashboard'});},
        className:'px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700'},'Return to Dashboard')
    );
  }

  return h('div',{className:'space-y-6 max-w-5xl'},
    h('div',{className:'flex items-center gap-3'},
      h('button',{onClick:function(){dispatch({type:'NAVIGATE',page:'ddhs/dashboard'});},
        className:'p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors'},AL&&h(AL,{size:20})),
      h('div',{},
        h('h1',{className:'text-xl font-bold text-gray-900'},'AI-Assisted Doctor Recommendation'),
        h('p',{className:'text-gray-500 text-sm'},'Formula: Score = 0.4\u00d7Specialization + 0.3\u00d7Distance + 0.3\u00d7PatientLoad')
      )
    ),
    h('div',{className:'bg-red-50 border border-red-200 rounded-xl p-5'},
      h('div',{className:'flex items-center gap-2 mb-3'},AT&&h(AT,{size:18,className:'text-red-600'}),h('h3',{className:'font-semibold text-red-900'},'Coverage Required')),
      h('div',{className:'grid sm:grid-cols-3 gap-4 text-sm'},
        h('div',{},h('p',{className:'text-red-600 text-xs font-medium uppercase mb-1'},'Absent Doctor'),h('p',{className:'font-semibold text-gray-900'},absentDoc.name||'Unknown'),h('p',{className:'text-gray-500'},absentDoc.specialization||'\u2014')),
        h('div',{},h('p',{className:'text-red-600 text-xs font-medium uppercase mb-1'},'PHC Needing Coverage'),h('p',{className:'font-semibold text-gray-900'},absentPhc.name),h('p',{className:'text-gray-500 text-xs'},absentPhc.location||'\u2014')),
        h('div',{},h('p',{className:'text-red-600 text-xs font-medium uppercase mb-1'},'Current Queue'),h('p',{className:'font-bold text-2xl text-gray-900'},absentPhc.patientsWaiting),h('p',{className:'text-gray-500'},absentPhc.avgWaitingTime+' min avg'))
      )
    ),
    h('div',{className:'bg-blue-50 border border-blue-200 rounded-xl px-5 py-3 flex items-center gap-3'},
      Info&&h(Info,{size:18,className:'text-blue-600 flex-shrink-0'}),
      h('p',{className:'text-blue-800 text-sm'},'AI only RECOMMENDS candidates. ',h('strong',{},'DDHS has final authority'),' to approve, reject, or choose another doctor. All decisions are recorded in the audit log.')
    ),
    h('div',{className:'bg-gray-50 rounded-xl px-5 py-3 flex flex-wrap gap-4 items-center'},
      h('span',{className:'font-medium text-gray-600 text-xs uppercase tracking-wide'},'Current AI Weights:'),
      h('span',{className:'text-blue-700 text-xs'},'Specialization: '+state.aiWeights.specialization+'%'),
      h('span',{className:'text-teal-700 text-xs'},'Distance: '+state.aiWeights.distance+'%'),
      h('span',{className:'text-green-700 text-xs'},'Patient Load: '+state.aiWeights.patientLoad+'%'),
      h('button',{onClick:function(){dispatch({type:'NAVIGATE',page:'admin/ai-weights'});},className:'ml-auto text-xs text-blue-600 hover:underline'},'Configure \u2192')
    ),
    ranked.length===0?h('div',{className:'text-center py-16 text-gray-400'},
      Sp&&h(Sp,{size:40,className:'mx-auto mb-4 opacity-30'}),
      h('p',{className:'text-lg font-medium'},'No available candidates found'),
      h('p',{className:'text-sm mt-1'},'All eligible doctors are absent, assigned elsewhere, or from the same PHC.')
    ):
    h('div',{className:'space-y-4'},
      ranked.map(function(doc,idx){
        var phc=state.phcs.find(function(p){return p.id===doc.homePhcId;})||{name:'Unknown'};
        var rankBgs=['bg-blue-700','bg-blue-600','bg-teal-600','bg-gray-500','bg-gray-400'];
        var isTop=idx===0;
        return h(window.Card,{key:doc.id,className:'p-5 '+(isTop?'ring-2 ring-blue-300 shadow-md':'hover:shadow-md')+' transition-all'},
          h('div',{className:'flex items-start gap-4 flex-wrap'},
            h('div',{className:'flex flex-col items-center gap-1 flex-shrink-0'},
              h('div',{className:'w-11 h-11 rounded-xl text-white text-base font-bold flex items-center justify-center '+(rankBgs[idx]||'bg-gray-400')},'#'+(idx+1)),
              h('span',{className:'text-xs text-gray-400'},'Rank')
            ),
            h('div',{className:'flex-1 min-w-0'},
              h('div',{className:'flex flex-wrap items-center gap-2 mb-3'},
                h('h3',{className:'font-bold text-gray-900 text-lg'},doc.name),
                h(window.Badge,{status:'available'},'Available'),
                isTop&&h('span',{className:'px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-bold'},'\u2605 Top Candidate'),
                h('span',{className:'ml-auto text-2xl font-black text-blue-700'},doc.score.toFixed(3)),
                h('span',{className:'text-xs text-gray-400 self-end mb-1'},'AI Score')
              ),
              h('div',{className:'grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3'},
                h('div',{className:'bg-gray-50 rounded-lg p-2'},h('p',{className:'text-xs text-gray-400'},'Specialization'),h('p',{className:'font-medium text-gray-900 text-xs leading-snug'},doc.specialization)),
                h('div',{className:'bg-gray-50 rounded-lg p-2'},h('p',{className:'text-xs text-gray-400'},'Home PHC'),h('p',{className:'font-medium text-gray-900 text-xs leading-snug'},phc.name)),
                h('div',{className:'bg-gray-50 rounded-lg p-2'},h('p',{className:'text-xs text-gray-400'},'Distance'),h('p',{className:'font-medium text-gray-900'},doc.dist+' km')),
                h('div',{className:'bg-gray-50 rounded-lg p-2'},h('p',{className:'text-xs text-gray-400'},'Served Today'),h('p',{className:'font-medium text-gray-900'},doc.patientsServedToday+' pts'))
              ),
              h(window.AIScoreBar,{spec:doc.specScore,dist:doc.distScore,load:doc.loadScore}),
              isTop&&h('div',{className:'mt-3'},
                h('button',{onClick:function(){setExplain(!explain);},
                  className:'text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 mb-2'},
                  Info&&h(Info,{size:12}),'Explain Recommendation'),
                explain&&h('div',{className:'p-4 bg-blue-50 rounded-xl border border-blue-100 space-y-1.5'},
                  h('p',{className:'font-semibold text-blue-900 text-sm mb-2'},'Why this doctor was ranked #1:'),
                  [
                    {ok:doc.specScore===1,text:'Exact specialization match ('+doc.specialization+')'},
                    {ok:true,text:'Available and on duty at home PHC'},
                    {ok:doc.dist<25,text:doc.dist<25?'Within recommended travel distance ('+doc.dist+' km)':'Travel distance: '+doc.dist+' km (review required)'},
                    {ok:doc.patientsServedToday<20,text:'Patient load: '+doc.patientsServedToday+' served today (threshold: 20)'},
                    {ok:true,text:'Not currently assigned elsewhere'},
                    {ok:true,text:'Cross-PHC assignment from a different home PHC'}
                  ].map(function(item,i){
                    return h('div',{key:i,className:'flex items-start gap-2 text-xs'},
                      h('span',{className:item.ok?'text-green-600 font-bold':'text-yellow-600 font-bold'},item.ok?'\u2713':'\u25cb'),
                      h('span',{className:item.ok?'text-green-800':'text-yellow-700'},item.text)
                    );
                  })
                )
              )
            ),
            h('div',{className:'flex flex-col gap-2 flex-shrink-0'},
              h('button',{
                onClick:function(){
                  dispatch({type:'APPROVE_SUBSTITUTE',doctorId:doc.id,toPhcId:absentDoc.homePhcId,aiScore:doc.score,reason:'Substitute for '+absentDoc.name});
                  setSuccess(doc);
                },
                className:'flex items-center gap-1.5 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors'
              },Ck&&h(Ck,{size:15}),'Approve'),
              h('button',{className:'px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium'},'Details')
            )
          )
        );
      })
    )
  );
};

// ── PHC Management ──────────────────────────────────────────
window.PHCManagementPage=function PHCManagementPage(){
  var ctx=R.useContext(window.AppContext);
  var state=ctx.state; var dispatch=ctx.dispatch;
  var sv=R.useState(''); var setSv=sv[1]; var search=sv[0];
  var tf=R.useState('All'); var setTf=tf[1]; var talukF=tf[0];
  var sf=R.useState('All'); var setSf=sf[1]; var statF=sf[0];
  var sel=R.useState(null); var setSel=sel[1]; var selPhc=sel[0];
  var filtered=state.phcs.filter(function(p){
    return(p.name.toLowerCase().includes(search.toLowerCase())||p.location.toLowerCase().includes(search.toLowerCase()))&&
      (talukF==='All'||p.taluk===talukF)&&(statF==='All'||p.status===statF);
  });
  var sc=window.phcStatusColor;
  var taluks=['All'].concat(window.TALUKS);
  return h('div',{className:'space-y-5'},
    h('div',{className:'flex items-center justify-between'},
      h('div',{},h('h1',{className:'text-xl font-bold text-gray-900'},'PHC Management'),h('p',{className:'text-gray-500 text-sm'},filtered.length+' of '+state.phcs.length+' PHCs')),
      h('button',{className:'flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700'},icons.Plus&&h(icons.Plus,{size:15}),'Add PHC')
    ),
    h('div',{className:'flex flex-wrap gap-3'},
      h(window.SearchInput,{placeholder:'Search PHC...',value:search,onChange:function(e){setSv(e.target.value);}}),
      h('select',{value:talukF,onChange:function(e){setTf(e.target.value);},className:'px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white'},
        taluks.map(function(t){return h('option',{key:t},t);})),
      h('select',{value:statF,onChange:function(e){setSf(e.target.value);},className:'px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white'},
        ['All','normal','moderate','critical'].map(function(s){return h('option',{key:s,value:s},s.charAt(0).toUpperCase()+s.slice(1));}))
    ),
    h('div',{className:'overflow-x-auto bg-white rounded-xl border border-gray-100 shadow-sm'},
      h('table',{className:'w-full text-sm'},
        h('thead',{},h('tr',{className:'bg-gray-50 border-b border-gray-200'},
          ['PHC ID','Name','Taluk','Doctors','Patients','Avg Wait','Med Alerts','Status','Action'].map(function(c){
            return h('th',{key:c,className:'text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide'},c);
          })
        )),
        h('tbody',{},filtered.map(function(phc){
          var c=sc(phc.status);
          var wc=window.waitColor(phc.avgWaitingTime);
          return h('tr',{key:phc.id,className:'border-b border-gray-100 hover:bg-gray-50 cursor-pointer',onClick:function(){setSel(phc);}},
            h('td',{className:'px-4 py-3 text-xs text-gray-400 font-mono'},phc.id),
            h('td',{className:'px-4 py-3'},h('div',{className:'flex items-center gap-2'},h('div',{className:'w-2 h-2 rounded-full flex-shrink-0 '+c.dot}),h('span',{className:'font-medium text-gray-900'},phc.name))),
            h('td',{className:'px-4 py-3 text-gray-600 text-xs'},phc.taluk),
            h('td',{className:'px-4 py-3 font-medium '+(phc.doctorsAbsent>0?'text-red-700':'text-gray-900')},phc.doctorsOnDuty+'/'+phc.doctorsAssigned),
            h('td',{className:'px-4 py-3 font-medium '+(phc.patientsWaiting>50?'text-red-700':phc.patientsWaiting>30?'text-yellow-700':'text-gray-900')},phc.patientsWaiting),
            h('td',{className:'px-4 py-3 font-medium '+wc.text},phc.avgWaitingTime+' min'),
            h('td',{className:'px-4 py-3'},phc.medicineAlerts>0?h('span',{className:'text-orange-600 font-semibold'},phc.medicineAlerts):h('span',{className:'text-gray-300'},'\u2014')),
            h('td',{className:'px-4 py-3'},h(window.Badge,{status:phc.status},phc.status.charAt(0).toUpperCase()+phc.status.slice(1))),
            h('td',{className:'px-4 py-3'},h('button',{onClick:function(e){e.stopPropagation();setSel(phc);},className:'text-blue-600 hover:underline text-xs font-medium'},'View'))
          );
        }))
      )
    ),
    selPhc&&h(window.Modal,{isOpen:true,onClose:function(){setSel(null);},title:selPhc.name,size:'lg'},
      h('div',{className:'space-y-4'},
        h('div',{className:'grid grid-cols-2 gap-3 text-sm'},
          h('div',{},h('p',{className:'text-xs text-gray-400 mb-0.5'},'PHC ID'),h('p',{className:'font-mono font-medium'},selPhc.id)),
          h('div',{},h('p',{className:'text-xs text-gray-400 mb-0.5'},'Taluk'),h('p',{className:'font-medium'},selPhc.taluk)),
          h('div',{className:'col-span-2'},h('p',{className:'text-xs text-gray-400 mb-0.5'},'Location'),h('p',{className:'font-medium'},selPhc.location))
        ),
        h('div',{className:'grid grid-cols-3 gap-3'},
          h('div',{className:'bg-gray-50 rounded-xl p-3 text-center'},h('p',{className:'text-2xl font-bold text-gray-900'},selPhc.doctorsOnDuty+'/'+selPhc.doctorsAssigned),h('p',{className:'text-xs text-gray-500 mt-1'},'Doctors')),
          h('div',{className:'bg-gray-50 rounded-xl p-3 text-center'},h('p',{className:'text-2xl font-bold text-gray-900'},selPhc.patientsWaiting),h('p',{className:'text-xs text-gray-500 mt-1'},'Waiting')),
          h('div',{className:'bg-gray-50 rounded-xl p-3 text-center'},h('p',{className:'text-2xl font-bold text-gray-900'},selPhc.avgWaitingTime+'m'),h('p',{className:'text-xs text-gray-500 mt-1'},'Avg Wait'))
        ),
        h('h4',{className:'font-semibold text-gray-900 text-sm'},'Assigned Doctors'),
        h('div',{className:'space-y-2'},
          state.doctors.filter(function(d){return d.homePhcId===selPhc.id;}).map(function(d){
            return h('div',{key:d.id,className:'flex items-center justify-between p-3 bg-gray-50 rounded-lg'},
              h('div',{},h('p',{className:'font-medium text-gray-900 text-sm'},d.name),h('p',{className:'text-xs text-gray-500'},d.specialization)),
              h('div',{className:'text-right'},h(window.Badge,{status:d.status},d.status),d.checkInTime&&h('p',{className:'text-xs text-gray-400 mt-0.5'},'In: '+d.checkInTime))
            );
          })
        )
      )
    )
  );
};

// ── Attendance Page ────────────────────────────────────────
window.AttendancePage=function AttendancePage(){
  var ctx=R.useContext(window.AppContext);
  var state=ctx.state; var dispatch=ctx.dispatch;
  var search=R.useState(''); var setSearch=search[1]; var sv=search[0];
  var sf=R.useState('All'); var setSf=sf[1]; var statF=sf[0];
  var abMod=R.useState(null); var setAbMod=abMod[1]; var abModal=abMod[0];
  var abReason=R.useState(''); var setAbReason=abReason[1]; var reason=abReason[0];
  var docs=state.doctors.filter(function(d){
    return(sv===''||d.name.toLowerCase().includes(sv.toLowerCase())||d.specialization.toLowerCase().includes(sv.toLowerCase()))&&
      (statF==='All'||d.status===statF);
  });
  var total=state.doctors.length;
  var present=state.doctors.filter(function(d){return d.status==='available'||d.status==='delayed';}).length;
  var absentC=state.doctors.filter(function(d){return d.status==='absent';}).length;
  var leaveC=state.doctors.filter(function(d){return d.status==='on-leave';}).length;
  return h('div',{className:'space-y-5'},
    h('h1',{className:'text-xl font-bold text-gray-900'},'Doctor Attendance \u2014 22 September 2026'),
    h('div',{className:'grid grid-cols-4 gap-4'},
      [{l:'Total',v:total,c:'text-gray-900'},{l:'Present',v:present,c:'text-green-700'},{l:'Absent',v:absentC,c:'text-red-700'},{l:'On Leave',v:leaveC,c:'text-yellow-700'}].map(function(s){
        return h(window.Card,{key:s.l,className:'p-4 text-center'},h('p',{className:'text-2xl font-bold '+s.c},s.v),h('p',{className:'text-xs text-gray-500 mt-1'},s.l));
      })
    ),
    h('div',{className:'flex flex-wrap gap-3'},
      h(window.SearchInput,{placeholder:'Search doctor...',value:sv,onChange:function(e){setSearch(e.target.value);}}),
      h('select',{value:statF,onChange:function(e){setSf(e.target.value);},className:'px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white'},
        ['All','available','absent','on-leave','delayed'].map(function(s){return h('option',{key:s,value:s},s.charAt(0).toUpperCase()+s.slice(1));}))
    ),
    h('div',{className:'overflow-x-auto bg-white rounded-xl border border-gray-100 shadow-sm'},
      h('table',{className:'w-full text-sm'},
        h('thead',{},h('tr',{className:'bg-gray-50 border-b border-gray-200'},
          ['Doctor','Specialization','PHC','Check-in','Status','Reason','Actions'].map(function(c){return h('th',{key:c,className:'text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide'},c);})
        )),
        h('tbody',{},docs.map(function(doc){
          var phc=state.phcs.find(function(p){return p.id===doc.homePhcId;})||{name:'\u2014'};
          return h('tr',{key:doc.id,className:'border-b border-gray-100 hover:bg-gray-50'},
            h('td',{className:'px-4 py-3 font-medium text-gray-900'},doc.name),
            h('td',{className:'px-4 py-3 text-gray-600 text-xs'},doc.specialization),
            h('td',{className:'px-4 py-3 text-gray-500 text-xs'},phc.name),
            h('td',{className:'px-4 py-3 text-gray-600'},doc.checkInTime||'\u2014'),
            h('td',{className:'px-4 py-3'},h(window.Badge,{status:doc.status},doc.status.replace(/-/g,' '))),
            h('td',{className:'px-4 py-3 text-gray-400 text-xs'},doc.leaveReason||'\u2014'),
            h('td',{className:'px-4 py-3'},
              h('div',{className:'flex gap-1'},
                (doc.status==='absent'||doc.status==='on-leave'||doc.status==='delayed')&&
                  h('button',{onClick:function(){dispatch({type:'CHECK_IN',doctorId:doc.id});},className:'px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200'},'Check In'),
                doc.status==='available'&&h('button',{onClick:function(){dispatch({type:'CHECK_OUT',doctorId:doc.id});},className:'px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200'},'Check Out'),
                doc.status==='available'&&h('button',{onClick:function(){setAbMod(doc);setAbReason('');},className:'px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200'},'Mark Absent')
              )
            )
          );
        }))
      )
    ),
    abModal&&h(window.Modal,{isOpen:true,onClose:function(){setAbMod(null);},title:'Mark Doctor Absent',
      footer:[
        h('button',{key:'c',onClick:function(){setAbMod(null);},className:'px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50'},'Cancel'),
        h('button',{key:'ok',onClick:function(){dispatch({type:'MARK_ABSENT',doctorId:abModal.id,reason:reason||'Not reported'});setAbMod(null);},className:'px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700'},'Confirm Absent')
      ]
    },
      h('p',{className:'text-gray-700 mb-4'},'Marking ',h('strong',{},abModal.name),' as absent. An alert will be sent to DDHS and AI will recommend substitutes.'),
      h('label',{className:'block text-sm font-medium text-gray-700 mb-1.5'},'Reason for Absence'),
      h('input',{type:'text',value:reason,onChange:function(e){setAbReason(e.target.value);},placeholder:'e.g., Leave, Emergency, Medical...',
        className:'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400'})
    )
  );
};

// ── Audit Log ──────────────────────────────────────────────
window.AuditLogPage=function AuditLogPage(){
  var ctx=R.useContext(window.AppContext);
  var state=ctx.state;
  var logs=state.auditLogs||[];
  function rowCls(action){
    if(action.includes('Approved'))return'border-l-4 border-l-green-400';
    if(action.includes('Rejected')||action.toLowerCase().includes('absent'))return'border-l-4 border-l-red-400';
    if(action.toLowerCase().includes('alert')||action.toLowerCase().includes('stock')||action.toLowerCase().includes('expiry'))return'border-l-4 border-l-orange-400';
    return'';
  }
  return h('div',{className:'space-y-5'},
    h('div',{className:'flex items-center justify-between'},
      h('div',{},h('h1',{className:'text-xl font-bold text-gray-900'},'Audit Log'),h('p',{className:'text-gray-500 text-sm'},logs.length+' records')),
      h('button',{onClick:function(){alert('Export feature ready for backend integration.');},
        className:'flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200'},
        icons.Download&&h(icons.Download,{size:15}),'Export CSV')
    ),
    h('div',{className:'overflow-x-auto bg-white rounded-xl border border-gray-100 shadow-sm'},
      h('table',{className:'w-full text-sm'},
        h('thead',{},h('tr',{className:'bg-gray-50 border-b border-gray-200'},
          ['Timestamp','User','Role','Action','PHC','Doctor','Details','Score'].map(function(c){return h('th',{key:c,className:'text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide'},c);})
        )),
        h('tbody',{},logs.map(function(log){
          var phc=log.phcId&&state.phcs.find(function(p){return p.id===log.phcId;});
          var doc=log.doctorId&&state.doctors.find(function(d){return d.id===log.doctorId;});
          return h('tr',{key:log.id,className:'border-b border-gray-100 hover:bg-gray-50 '+rowCls(log.action)},
            h('td',{className:'px-4 py-3 text-xs text-gray-400 font-mono whitespace-nowrap'},log.timestamp),
            h('td',{className:'px-4 py-3 font-medium text-gray-900 text-xs'},log.user),
            h('td',{className:'px-4 py-3'},h(window.Badge,{status:log.role==='DDHS'?'info':log.role==='System'?'delayed':'available'},log.role)),
            h('td',{className:'px-4 py-3 text-gray-700 text-xs'},log.action),
            h('td',{className:'px-4 py-3 text-gray-500 text-xs'},phc?phc.name:'\u2014'),
            h('td',{className:'px-4 py-3 text-gray-500 text-xs'},doc?doc.name:'\u2014'),
            h('td',{className:'px-4 py-3 text-gray-400 text-xs max-w-xs truncate'},log.details),
            h('td',{className:'px-4 py-3 text-center'},log.score?h('span',{className:'font-bold text-blue-700 text-sm'},log.score.toFixed(2)):h('span',{className:'text-gray-300'},'\u2014'))
          );
        }))
      )
    )
  );
};

// Alias for DDHS Settings
window.DDHSSettingsPage=function DDHSSettingsPage(){
  var ctx=R.useContext(window.AppContext);
  var dispatch=ctx.dispatch;
  return h('div',{className:'max-w-lg'},
    h('h1',{className:'text-xl font-bold text-gray-900 mb-5'},'Settings'),
    h(window.Card,{className:'p-5'},
      h('p',{className:'text-gray-600 text-sm mb-4'},'Settings are managed by the System Administrator.'),
      h('button',{onClick:function(){dispatch({type:'NAVIGATE',page:'admin/settings'});},className:'px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700'},'Go to System Settings')
    )
  );
};

console.log('[SmartPHC] DDHS pages loaded. Candidates algorithm ready.');
})();
