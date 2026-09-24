
// registration.js - Patient Registration + QR Scanner
(function(){
var R=React; var h=R.createElement; var icons=window.lucideReact||{};

window.PatientRegistrationPage=function PatientRegistrationPage(){
  var ctx=R.useContext(window.AppContext);
  var state=ctx.state; var dispatch=ctx.dispatch;
  var tabState=R.useState('new'); var tab=tabState[0]; var setTab=tabState[1];
  var formState=R.useState({name:'',dob:'',gender:'Male',phone:'',village:'',emergencyContact:'',consent:false});
  var form=formState[0]; var setForm=formState[1];
  var resultState=R.useState(null); var result=resultState[0]; var setResult=resultState[1];
  var searchState=R.useState(''); var sv=searchState[0]; var setSearch=searchState[1];
  var scanState=R.useState(false); var scanning=scanState[0]; var setScanning=scanState[1];
  var selPatState=R.useState(null); var selPat=selPatState[0]; var setSelPat=selPatState[1];

  var role=state.currentUser?state.currentUser.role:'staff';
  var userPhcId=state.currentUser&&state.currentUser.phcId||'PHC001';

  function handleSubmit(){
    if(!form.name||!form.phone||!form.consent){return alert('Please fill required fields and accept consent.');}
    var pat=Object.assign({},form,{phcId:userPhcId});
    dispatch({type:'REGISTER_PATIENT',patient:pat});
    var newId='SPHC-2026-'+String(state.patients.length+61).padStart(5,'0');
    setResult({id:newId,name:form.name,phone:form.phone});
  }

  var filteredPats=sv?state.patients.filter(function(p){
    var q=sv.toLowerCase();
    return p.name.toLowerCase().includes(q)||p.phone.includes(q)||(p.village||'').toLowerCase().includes(q);
  }):state.patients.slice(0,15);

  var UP=icons.UserPlus; var QR=icons.QrCode; var Sc=icons.ScanLine; var Us=icons.User;

  return h('div',{className:'space-y-5 max-w-4xl'},
    h('div',{className:'flex items-center gap-3'},
      UP&&h(UP,{size:22,className:'text-blue-600'}),
      h('div',{},h('h1',{className:'text-xl font-bold text-gray-900'},'Patient Registration'),h('p',{className:'text-gray-500 text-sm'},'Register new patients or look up existing records'))
    ),
    h('div',{className:'flex gap-1 bg-gray-100 p-1 rounded-xl w-fit'},
      ['new','search'].map(function(t){
        var lbl=t==='new'?'New Registration':'Scan / Search Patient';
        var ic=t==='new'?(UP&&h(UP,{size:15})):(QR&&h(QR,{size:15}));
        return h('button',{key:t,onClick:function(){setTab(t);setResult(null);},
          className:'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all '+(tab===t?'bg-white text-blue-700 shadow-sm':'text-gray-500 hover:text-gray-700')},ic,lbl);
      })
    ),
    tab==='new'&&!result&&h(window.Card,{className:'p-6'},
      h('h3',{className:'font-semibold text-gray-900 mb-4'},'New Patient Registration'),
      h('div',{className:'grid sm:grid-cols-2 gap-4'},
        h('div',{className:'sm:col-span-2'},
          h('label',{className:'block text-sm font-medium text-gray-700 mb-1.5'},'Full Name *'),
          h('input',{type:'text',value:form.name,onChange:function(e){setForm(function(f){return Object.assign({},f,{name:e.target.value});});},
            placeholder:'Enter patient full name',className:'w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'})
        ),
        h('div',{},
          h('label',{className:'block text-sm font-medium text-gray-700 mb-1.5'},'Date of Birth *'),
          h('input',{type:'date',value:form.dob,onChange:function(e){setForm(function(f){return Object.assign({},f,{dob:e.target.value});});},
            className:'w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'})
        ),
        h('div',{},
          h('label',{className:'block text-sm font-medium text-gray-700 mb-1.5'},'Gender'),
          h('select',{value:form.gender,onChange:function(e){setForm(function(f){return Object.assign({},f,{gender:e.target.value});});},
            className:'w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'},
            ['Male','Female','Other'].map(function(g){return h('option',{key:g},g);}))
        ),
        h('div',{},
          h('label',{className:'block text-sm font-medium text-gray-700 mb-1.5'},'Phone Number *'),
          h('input',{type:'tel',value:form.phone,onChange:function(e){setForm(function(f){return Object.assign({},f,{phone:e.target.value});});},
            placeholder:'10-digit mobile number',className:'w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'})
        ),
        h('div',{},
          h('label',{className:'block text-sm font-medium text-gray-700 mb-1.5'},'Village / Address'),
          h('input',{type:'text',value:form.village,onChange:function(e){setForm(function(f){return Object.assign({},f,{village:e.target.value});});},
            placeholder:'Village or area name',className:'w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'})
        ),
        h('div',{},
          h('label',{className:'block text-sm font-medium text-gray-700 mb-1.5'},'Emergency Contact'),
          h('input',{type:'tel',value:form.emergencyContact,onChange:function(e){setForm(function(f){return Object.assign({},f,{emergencyContact:e.target.value});});},
            placeholder:'Emergency phone number',className:'w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'})
        )
      ),
      h('div',{className:'mt-4 flex items-start gap-3'},
        h('input',{type:'checkbox',id:'consent',checked:form.consent,onChange:function(e){setForm(function(f){return Object.assign({},f,{consent:e.target.checked});});},className:'mt-0.5 accent-blue-600'}),
        h('label',{htmlFor:'consent',className:'text-sm text-gray-600'},'I consent to sharing my health information with authorized PHC staff for the purpose of medical care. The data will be stored securely and used only for healthcare purposes.')
      ),
      h('div',{className:'mt-5 flex gap-3'},
        h('button',{onClick:handleSubmit,className:'flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors'},UP&&h(UP,{size:16}),'Register Patient'),
        h('button',{onClick:function(){setForm({name:'',dob:'',gender:'Male',phone:'',village:'',emergencyContact:'',consent:false});},
          className:'px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50'},'Clear')
      )
    ),
    tab==='new'&&result&&h(window.Card,{className:'p-8 text-center'},
      h('div',{className:'w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'},icons.CheckCircle&&h(icons.CheckCircle,{size:32,className:'text-green-600'})),
      h('h3',{className:'text-xl font-bold text-gray-900 mb-1'},'Patient Registered!'),
      h('p',{className:'text-gray-500 text-sm mb-6'},result.name+' has been successfully registered'),
      h('div',{className:'bg-gray-50 rounded-xl p-6 mb-6 inline-block'},
        h('p',{className:'text-xs text-gray-400 mb-1 uppercase tracking-wide'},'Patient ID'),
        h('p',{className:'text-2xl font-bold text-blue-700 font-mono mb-4'},result.id),
        h(window.QRDisplay,{patientId:result.id,size:140})
      ),
      h('p',{className:'text-xs text-gray-400 mb-6'},'QR code contains only the Patient ID - no medical information stored in code'),
      h('div',{className:'flex gap-3 justify-center'},
        h('button',{onClick:function(){window.print();},className:'px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700'},icons.Printer&&h(icons.Printer,{size:15})+' Print QR'),
        h('button',{onClick:function(){setResult(null);setForm({name:'',dob:'',gender:'Male',phone:'',village:'',emergencyContact:'',consent:false});},
          className:'px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50'},'Register Another')
      )
    ),
    tab==='search'&&h('div',{className:'space-y-4'},
      h('div',{className:'flex gap-3'},
        h('button',{onClick:function(){setScanning(true);setTimeout(function(){setScanning(false);setSelPat(state.patients[0]);},2000);},
          className:'flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium transition-colors'},
          Sc&&h(Sc,{size:16}),'Scan QR Code'),
        h('div',{className:'flex-1'},h(window.SearchInput,{placeholder:'Search by name, phone or village...',value:sv,onChange:function(e){setSearch(e.target.value);}}))
      ),
      scanning&&h('div',{className:'flex items-center justify-center gap-3 p-8 bg-gray-900 rounded-xl text-white'},
        h('div',{className:'w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin'}),
        h('span',{className:'text-sm'},'Scanning QR code...')
      ),
      h('div',{className:'overflow-x-auto bg-white rounded-xl border border-gray-100 shadow-sm'},
        h('table',{className:'w-full text-sm'},
          h('thead',{},h('tr',{className:'bg-gray-50 border-b border-gray-200'},
            ['Patient ID','Name','DOB','Phone','Village','Last Visit','Action'].map(function(c){return h('th',{key:c,className:'text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide'},c);})
          )),
          h('tbody',{},filteredPats.map(function(p){
            var last=p.visitHistory&&p.visitHistory[0];
            return h('tr',{key:p.id,className:'border-b border-gray-100 hover:bg-gray-50 cursor-pointer',onClick:function(){setSelPat(p);}},
              h('td',{className:'px-4 py-3 font-mono text-xs text-blue-700'},p.id),
              h('td',{className:'px-4 py-3 font-medium text-gray-900'},p.name),
              h('td',{className:'px-4 py-3 text-gray-500 text-xs'},p.dob),
              h('td',{className:'px-4 py-3 text-gray-600'},p.phone),
              h('td',{className:'px-4 py-3 text-gray-500 text-xs'},p.village||'-'),
              h('td',{className:'px-4 py-3 text-gray-500 text-xs'},last?last.date:'-'),
              h('td',{className:'px-4 py-3'},h('button',{onClick:function(e){e.stopPropagation();setSelPat(p);},className:'text-blue-600 hover:underline text-xs font-medium'},'View'))
            );
          }))
        )
      ),
      selPat&&h(window.Modal,{isOpen:true,onClose:function(){setSelPat(null);},title:selPat.name+' \u2014 Patient Record',size:'lg'},
        h('div',{className:'space-y-4'},
          h('div',{className:'flex items-start gap-6'},
            h(window.QRDisplay,{patientId:selPat.id,size:100}),
            h('div',{className:'grid grid-cols-2 gap-3 text-sm flex-1'},
              h('div',{},h('p',{className:'text-xs text-gray-400'},'Patient ID'),h('p',{className:'font-mono font-semibold text-blue-700'},selPat.id)),
              h('div',{},h('p',{className:'text-xs text-gray-400'},'Gender'),h('p',{className:'font-medium'},selPat.gender)),
              h('div',{},h('p',{className:'text-xs text-gray-400'},'Date of Birth'),h('p',{className:'font-medium'},selPat.dob)),
              h('div',{},h('p',{className:'text-xs text-gray-400'},'Phone'),h('p',{className:'font-medium'},selPat.phone)),
              h('div',{},h('p',{className:'text-xs text-gray-400'},'Village'),h('p',{className:'font-medium'},selPat.village||'-')),
              h('div',{},h('p',{className:'text-xs text-gray-400'},'PHC'),h('p',{className:'font-medium text-xs'},(state.phcs.find(function(p2){return p2.id===selPat.registeredPhcId;})||{name:'-'}).name))
            )
          ),
          h('div',{},
            h('h4',{className:'font-semibold text-gray-900 text-sm mb-2'},'Visit History'),
            selPat.visitHistory&&selPat.visitHistory.length>0?
              h('div',{className:'space-y-2'},selPat.visitHistory.map(function(v,i){
                return h('div',{key:i,className:'p-3 bg-gray-50 rounded-lg text-sm'},
                  h('div',{className:'flex justify-between mb-1'},h('span',{className:'font-medium text-gray-900'},v.date),h('span',{className:'text-xs text-gray-400'},'Token: '+v.token)),
                  h('p',{className:'text-gray-600 text-xs'},'Diagnosis: '+v.diagnosis),
                  h('p',{className:'text-gray-400 text-xs'},'Rx: '+v.prescription)
                );
              })):h('p',{className:'text-gray-400 text-sm'},'No visit history')
          )
        )
      )
    )
  );
};

console.log('[SmartPHC] Registration loaded.');
})();
