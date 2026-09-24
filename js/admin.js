
// admin.js - Admin Dashboard, User Management, AI Weights, Settings
(function(){
var R=React; var h=R.createElement; var icons=window.lucideReact||{};

window.AdminDashboard=function AdminDashboard(){
  var ctx=R.useContext(window.AppContext);
  var state=ctx.state; var dispatch=ctx.dispatch;
  var Sh=icons.Shield; var Us=icons.Users; var B2=icons.Building2; var St=icons.Stethoscope;
  var Sp=icons.Sparkles; var Ft=icons.FileText; var Stg=icons.Settings; var Pil=icons.Pill;

  return h('div',{className:'space-y-6'},
    h('div',{className:'flex items-center gap-3'},
      Sh&&h(Sh,{size:24,className:'text-blue-600'}),
      h('div',{},h('h1',{className:'text-2xl font-bold text-gray-900'},'System Administration'),h('p',{className:'text-gray-500 text-sm'},'Smart PHC Management System · Admin Console'))
    ),
    h('div',{className:'grid sm:grid-cols-2 lg:grid-cols-4 gap-4'},
      h(window.KPICard,{title:'Total Users',value:window.DEMO_USERS.length,icon:Us,color:'blue'}),
      h(window.KPICard,{title:'PHCs Managed',value:state.phcs.length,icon:B2,color:'teal'}),
      h(window.KPICard,{title:'Doctors Registered',value:state.doctors.length,icon:St,color:'green'}),
      h(window.KPICard,{title:'Medicines Tracked',value:state.medicines.length,icon:Pil,color:'purple'})
    ),
    h('div',{className:'grid sm:grid-cols-2 lg:grid-cols-4 gap-4'},
      [{l:'Manage Users',p:'admin/users',ic:'Users',desc:'Add, edit, deactivate user accounts',color:'blue'},{l:'PHC Management',p:'admin/phcs',ic:'Building2',desc:'PHC master data and configuration',color:'teal'},{l:'Doctor Registry',p:'admin/doctors',ic:'Stethoscope',desc:'Doctor profiles and specializations',color:'green'},{l:'AI Weights',p:'admin/ai-weights',ic:'Sparkles',desc:'Configure recommendation algorithm',color:'purple'},{l:'Audit Logs',p:'admin/audit',ic:'FileText',desc:'System-wide audit trail',color:'gray'},{l:'System Config',p:'admin/config',ic:'Settings',desc:'Thresholds, alerts, notifications',color:'orange'},{l:'Medicine Setup',p:'ddhs/medicine',ic:'Pill',desc:'Medicine master list management',color:'red'},{l:'System Settings',p:'admin/settings',ic:'Shield',desc:'Security, backup, integrations',color:'slate'}].map(function(item){
        var IC=icons[item.ic];
        return h(window.Card,{key:item.p,className:'p-5 hover:shadow-md transition-all cursor-pointer',onClick:function(){dispatch({type:'NAVIGATE',page:item.p});}},
          h('div',{className:'w-10 h-10 bg-'+item.color+'-100 rounded-xl flex items-center justify-center mb-3'},IC&&h(IC,{size:20,className:'text-'+item.color+'-600'})),
          h('p',{className:'font-semibold text-gray-900 text-sm'},item.l),
          h('p',{className:'text-xs text-gray-400 mt-1'},item.desc)
        );
      })
    ),
    h(window.Card,{className:'p-5'},
      h('h3',{className:'font-semibold text-gray-900 mb-3'},'System Health'),
      h('div',{className:'grid grid-cols-3 gap-4 text-center'},
        h('div',{},h('p',{className:'text-green-600 font-bold text-xl'},'✓'),h('p',{className:'text-xs text-gray-500'},'Database'),h('p',{className:'text-xs text-green-600'},'Healthy')),
        h('div',{},h('p',{className:'text-green-600 font-bold text-xl'},'✓'),h('p',{className:'text-xs text-gray-500'},'API Service'),h('p',{className:'text-xs text-green-600'},'Online')),
        h('div',{},h('p',{className:'text-yellow-500 font-bold text-xl'},'!'),h('p',{className:'text-xs text-gray-500'},'Backup'),h('p',{className:'text-xs text-yellow-600'},'Prototype'))
      )
    )
  );
};

window.AIWeightsPage=function AIWeightsPage(){
  var ctx=R.useContext(window.AppContext);
  var state=ctx.state; var dispatch=ctx.dispatch;
  var w=state.aiWeights;
  var specState=R.useState(w.specialization);var spec=specState[0];var setSpec=specState[1];
  var distState=R.useState(w.distance);var dist=distState[0];var setDist=distState[1];
  var loadState=R.useState(w.patientLoad);var load=loadState[0];var setLoad=loadState[1];
  var total=spec+dist+load;

  function handleSave(){
    if(Math.round(total)!==100){alert('Weights must sum to 100%. Current total: '+total+'%');return;}
    dispatch({type:'UPDATE_AI_WEIGHTS',weights:{specialization:spec,distance:dist,patientLoad:load}});
  }

  return h('div',{className:'space-y-6 max-w-2xl'},
    h('div',{className:'flex items-center gap-2'},icons.Sparkles&&h(icons.Sparkles,{size:22,className:'text-blue-600'}),h('div',{},h('h1',{className:'text-xl font-bold text-gray-900'},'AI Recommendation Weights'),h('p',{className:'text-gray-500 text-sm'},'Configure the scoring formula for substitute doctor recommendations'))),
    h('div',{className:'bg-blue-50 border border-blue-200 rounded-xl p-4'},
      h('p',{className:'font-mono text-blue-900 text-sm'},'Score = (Spec×'+spec+'%) + (Distance×'+dist+'%) + (PatientLoad×'+load+'%)'),
      h('p',{className:'text-blue-600 text-xs mt-1'},'Score ranges from 0.000 to 1.000. Higher = better candidate.')
    ),
    h(window.Card,{className:'p-6 space-y-6'},
      [{label:'Specialization Match',key:'spec',val:spec,setter:setSpec,desc:'Weight for matching doctor specialization to absent doctor',color:'blue'},{label:'Distance Score',key:'dist',val:dist,setter:setDist,desc:'Weight for proximity of doctor to the PHC needing coverage',color:'teal'},{label:'Patient Load Score',key:'load',val:load,setter:setLoad,desc:'Weight for current patient load of the candidate doctor',color:'green'}].map(function(item){
        return h('div',{key:item.key},
          h('div',{className:'flex items-center justify-between mb-2'},
            h('div',{},h('label',{className:'font-medium text-gray-900 text-sm'},item.label),h('p',{className:'text-xs text-gray-400'},item.desc)),
            h('div',{className:'flex items-center gap-2'},
              h('input',{type:'number',min:0,max:100,value:item.val,onChange:function(e){item.setter(parseInt(e.target.value,10)||0);},
                className:'w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center font-bold focus:outline-none focus:ring-2 focus:ring-blue-400'}),
              h('span',{className:'text-gray-500 text-sm'},'%')
            )
          ),
          h('input',{type:'range',min:0,max:100,value:item.val,onChange:function(e){item.setter(parseInt(e.target.value,10));},
            className:'w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600'})
        );
      }),
      h('div',{className:'pt-3 border-t border-gray-100'},
        h('div',{className:'flex items-center justify-between mb-2'},
          h('span',{className:'font-semibold text-gray-900'},'Total Weight'),
          h('span',{className:'font-bold text-lg '+(Math.round(total)===100?'text-green-600':'text-red-600')},total+'%')
        ),
        h('div',{className:'h-3 rounded-full overflow-hidden flex bg-gray-100'},
          h('div',{className:'bg-blue-500',style:{width:spec+'%'}}),
          h('div',{className:'bg-teal-500',style:{width:dist+'%'}}),
          h('div',{className:'bg-green-500',style:{width:load+'%'}})
        ),
        h('div',{className:'flex gap-4 mt-2 text-xs'},
          h('span',{className:'flex items-center gap-1'},h('span',{className:'w-2 h-2 rounded-full bg-blue-500'}),'Spec: '+spec+'%'),
          h('span',{className:'flex items-center gap-1'},h('span',{className:'w-2 h-2 rounded-full bg-teal-500'}),'Dist: '+dist+'%'),
          h('span',{className:'flex items-center gap-1'},h('span',{className:'w-2 h-2 rounded-full bg-green-500'}),'Load: '+load+'%')
        )
      ),
      h('div',{className:'flex gap-3 justify-end pt-3'},
        h('button',{onClick:function(){setSpec(40);setDist(30);setLoad(30);},className:'px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50'},'Reset to Default'),
        h('button',{onClick:handleSave,disabled:Math.round(total)!==100,className:'px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'},'Save Weights')
      )
    ),
    h(window.Card,{className:'p-5'},
      h('h3',{className:'font-semibold text-gray-900 mb-3 text-sm'},'Scoring Examples'),
      h('div',{className:'overflow-x-auto'},
        h('table',{className:'w-full text-xs'},
          h('thead',{},h('tr',{className:'border-b border-gray-200'},['Scenario','Spec','Dist','Load','Score'].map(function(c){return h('th',{key:c,className:'text-left px-3 py-2 text-gray-400 uppercase font-semibold'},c);}))),
          h('tbody',{},
            [{sc:'Perfect match, close, low load',sp:1.0,di:1.0,ld:1.0},{sc:'Same spec, moderate distance',sp:1.0,di:0.6,ld:0.7},{sc:'Different spec, close, free',sp:0.5,di:0.9,ld:1.0},{sc:'Different spec, far, busy',sp:0.5,di:0.3,ld:0.2}].map(function(ex,i){
              var score=((spec/100)*ex.sp+(dist/100)*ex.di+(load/100)*ex.ld).toFixed(3);
              return h('tr',{key:i,className:'border-b border-gray-100'},
                h('td',{className:'px-3 py-2 text-gray-700'},ex.sc),
                h('td',{className:'px-3 py-2 text-blue-600 font-medium'},ex.sp.toFixed(1)),
                h('td',{className:'px-3 py-2 text-teal-600 font-medium'},ex.di.toFixed(1)),
                h('td',{className:'px-3 py-2 text-green-600 font-medium'},ex.ld.toFixed(1)),
                h('td',{className:'px-3 py-2 font-bold text-gray-900'},score)
              );
            })
          )
        )
      )
    )
  );
};

window.UserManagementPage=function UserManagementPage(){
  var ctx=R.useContext(window.AppContext);
  var state=ctx.state;
  var users=window.DEMO_USERS||[];
  var roles={ddhs:'DDHS Authority',staff:'PHC Staff',doctor:'Doctor',patient:'Patient',admin:'Administrator'};
  return h('div',{className:'space-y-5'},
    h('div',{className:'flex items-center justify-between'},
      h('div',{},h('h1',{className:'text-xl font-bold text-gray-900'},'User Management'),h('p',{className:'text-gray-500 text-sm'},users.length+' registered users')),
      h('button',{className:'flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700'},icons.Plus&&h(icons.Plus,{size:15}),'Add User')
    ),
    h('div',{className:'overflow-x-auto bg-white rounded-xl border border-gray-100 shadow-sm'},
      h('table',{className:'w-full text-sm'},
        h('thead',{},h('tr',{className:'bg-gray-50 border-b border-gray-200'},
          ['User ID','Name','Email','Role','PHC','Status','Actions'].map(function(c){return h('th',{key:c,className:'text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide'},c);})
        )),
        h('tbody',{},users.map(function(u){
          var phcName=u.phcId?(state.phcs.find(function(p){return p.id===u.phcId;})||{name:u.phcId}).name:'—';
          return h('tr',{key:u.id,className:'border-b border-gray-100 hover:bg-gray-50'},
            h('td',{className:'px-4 py-3 font-mono text-xs text-gray-500'},u.id),
            h('td',{className:'px-4 py-3'},
              h('div',{className:'flex items-center gap-2'},
                h('div',{className:'w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-700'},u.avatar||u.name[0]),
                h('span',{className:'font-medium text-gray-900 text-sm'},u.name)
              )
            ),
            h('td',{className:'px-4 py-3 text-gray-600 text-xs'},u.email),
            h('td',{className:'px-4 py-3'},h(window.Badge,{status:'info'},roles[u.role]||u.role)),
            h('td',{className:'px-4 py-3 text-gray-500 text-xs'},phcName),
            h('td',{className:'px-4 py-3'},h(window.Badge,{status:'available'},'Active')),
            h('td',{className:'px-4 py-3'},
              h('div',{className:'flex gap-1'},
                h('button',{className:'px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200'},'Edit'),
                h('button',{className:'px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200'},'Disable')
              )
            )
          );
        }))
      )
    )
  );
};

window.SystemSettingsPage=function SystemSettingsPage(){
  return h('div',{className:'space-y-5 max-w-2xl'},
    h('h1',{className:'text-xl font-bold text-gray-900'},'System Settings'),
    h(window.Card,{className:'p-5'},
      h('h3',{className:'font-semibold text-gray-900 mb-4'},'Alert Thresholds'),
      h('div',{className:'space-y-4'},
        [{l:'Patient Waiting Threshold (Moderate)',v:'35',desc:'PHC flagged moderate above this'},{l:'Patient Waiting Threshold (Critical)',v:'60',desc:'PHC flagged critical above this'},{l:'Wait Time Threshold (Moderate, min)',v:'25',desc:'Moderate flag trigger'},{l:'Wait Time Threshold (Critical, min)',v:'45',desc:'Critical flag trigger'},{l:'Low Stock Threshold (%)',v:'20',desc:'Alert when stock below this % of minimum'}].map(function(s){
          return h('div',{key:s.l,className:'flex items-center justify-between gap-4'},
            h('div',{className:'flex-1'},h('p',{className:'font-medium text-gray-900 text-sm'},s.l),h('p',{className:'text-xs text-gray-400'},s.desc)),
            h('input',{type:'number',defaultValue:s.v,className:'w-20 px-2 py-1.5 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-400'})
          );
        })
      ),
      h('button',{className:'mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700'},'Save Settings')
    ),
    h(window.Card,{className:'p-5'},
      h('h3',{className:'font-semibold text-gray-900 mb-4'},'System Information'),
      h('div',{className:'space-y-2 text-sm'},
        [{l:'Application',v:'Smart PHC v1.0'},{l:'District',v:'Coimbatore, Tamil Nadu'},{l:'Database',v:'Prototype (In-Memory)'},{l:'AI Module',v:'Rule-based scoring engine'},{l:'Last Backup',v:'N/A (Prototype)'},{l:'API Version',v:'v1.0-prototype'}].map(function(s){
          return h('div',{key:s.l,className:'flex justify-between py-2 border-b border-gray-100'},
            h('span',{className:'text-gray-500'},s.l),h('span',{className:'font-medium text-gray-900'},s.v)
          );
        })
      )
    )
  );
};

window.AdminPHCPage=window.PHCManagementPage;
window.AdminDoctorPage=function AdminDoctorPage(){
  var ctx=R.useContext(window.AppContext);
  var state=ctx.state;
  var sv=R.useState('');var setSv=sv[1];var search=sv[0];
  var docs=state.doctors.filter(function(d){return!search||d.name.toLowerCase().includes(search.toLowerCase())||d.specialization.toLowerCase().includes(search.toLowerCase());});
  return h('div',{className:'space-y-5'},
    h('div',{className:'flex items-center justify-between'},
      h('div',{},h('h1',{className:'text-xl font-bold text-gray-900'},'Doctor Registry'),h('p',{className:'text-gray-500 text-sm'},docs.length+' doctors')),
      h('button',{className:'flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium'},icons.Plus&&h(icons.Plus,{size:15}),'Add Doctor')
    ),
    h(window.SearchInput,{placeholder:'Search doctor...',value:search,onChange:function(e){setSv(e.target.value);}}),
    h('div',{className:'overflow-x-auto bg-white rounded-xl border border-gray-100 shadow-sm'},
      h('table',{className:'w-full text-sm'},
        h('thead',{},h('tr',{className:'bg-gray-50 border-b border-gray-200'},
          ['ID','Name','Specialization','Home PHC','Status','Patients Today','Actions'].map(function(c){return h('th',{key:c,className:'text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase'},c);})
        )),
        h('tbody',{},docs.map(function(d){
          var phcName=(state.phcs.find(function(p){return p.id===d.homePhcId;})||{name:d.homePhcId}).name;
          return h('tr',{key:d.id,className:'border-b border-gray-100 hover:bg-gray-50'},
            h('td',{className:'px-4 py-3 font-mono text-xs text-gray-400'},d.id),
            h('td',{className:'px-4 py-3 font-medium text-gray-900'},d.name),
            h('td',{className:'px-4 py-3 text-gray-600 text-xs'},d.specialization),
            h('td',{className:'px-4 py-3 text-gray-500 text-xs'},phcName),
            h('td',{className:'px-4 py-3'},h(window.Badge,{status:d.status},d.status)),
            h('td',{className:'px-4 py-3 text-gray-700 font-medium'},d.patientsServedToday||0),
            h('td',{className:'px-4 py-3'},h('div',{className:'flex gap-1'},h('button',{className:'px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs'},'Edit'),h('button',{className:'px-2 py-1 bg-red-100 text-red-700 rounded text-xs'},'Remove')))
          );
        }))
      )
    )
  );
};

console.log('[SmartPHC] Admin pages loaded.');
})();
