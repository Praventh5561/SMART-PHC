// context.js - AppContext, Reducer, AppProvider
(function(){
var R=React;

window.AppContext=R.createContext(null);

function computePHCStatus(phc){
  if(phc.doctorsOnDuty===0||phc.avgWaitingTime>60||phc.patientsWaiting>60)return'critical';
  if(phc.avgWaitingTime>25||phc.patientsWaiting>35)return'moderate';
  return'normal';
}

function initialState(){
  var queues={};
  window.PHC_DATA.forEach(function(phc){
    var toks=[];
    for(var t=1;t<=Math.min(phc.patientsWaiting,8);t++)toks.push(phc.currentToken+t);
    queues[phc.id]={currentToken:phc.currentToken,serving:phc.currentToken,tokens:toks};
  });
  return{
    currentUser:null,
    currentPage:'login',
    phcs:JSON.parse(JSON.stringify(window.PHC_DATA)),
    doctors:JSON.parse(JSON.stringify(window.DOCTORS_DATA)),
    patients:JSON.parse(JSON.stringify(window.PATIENTS_DATA)),
    medicines:JSON.parse(JSON.stringify(window.MEDICINES_DATA)),
    queues:queues,
    attendance:JSON.parse(JSON.stringify(window.ATTENDANCE_DATA)),
    assignments:JSON.parse(JSON.stringify(window.ASSIGNMENTS_DATA)),
    notifications:JSON.parse(JSON.stringify(window.NOTIFICATIONS_DATA)),
    auditLogs:JSON.parse(JSON.stringify(window.AUDIT_LOGS_DATA)),
    aiWeights:Object.assign({},window.AI_WEIGHTS_DEFAULT),
    aiPendingAbsent:null,
    isOnline:true,
    toastMsg:null
  };
}

function reducer(state,action){
  switch(action.type){
    case'NAVIGATE':return Object.assign({},state,{currentPage:action.page});

    case'SET_USER':
      var role=action.user.role;
      var defPage={ddhs:'ddhs/dashboard',staff:'staff/dashboard',doctor:'doctor/dashboard',patient:'patient/dashboard',admin:'admin/dashboard'};
      return Object.assign({},state,{currentUser:action.user,currentPage:defPage[role]||'ddhs/dashboard'});

    case'LOGOUT':return Object.assign({},initialState());

    case'MARK_ABSENT':{
      var dId=action.doctorId;
      var newDocs=state.doctors.map(function(d){
        if(d.id===dId)return Object.assign({},d,{status:'absent',checkInTime:null,leaveReason:action.reason||'Not reported'});
        return d;
      });
      var doc=newDocs.find(function(d){return d.id===dId;})||{};
      var phc=state.phcs.find(function(p){return p.id===doc.homePhcId;})||{};
      var newPhcs=state.phcs.map(function(p){
        if(p.id===doc.homePhcId){
          var od=Math.max(0,p.doctorsOnDuty-1);
          return Object.assign({},p,{doctorsOnDuty:od,doctorsAbsent:p.doctorsAbsent+1,status:computePHCStatus(Object.assign({},p,{doctorsOnDuty:od}))});
        }
        return p;
      });
      var nId='N'+Date.now();
      var newNotif={id:nId,type:'absence',title:'Doctor Absent – '+(phc.name||''),message:doc.name+' ('+(doc.specialization||'')+') marked absent. Reason: '+(action.reason||'Not reported')+'.',phcId:doc.homePhcId,doctorId:dId,time:'Just now',read:false,severity:'critical'};
      var alId='AL'+Date.now();
      var newLog={id:alId,timestamp:'Just now',user:state.currentUser?state.currentUser.name:'Staff',role:state.currentUser?state.currentUser.role:'staff',action:'Marked doctor absent',phcId:doc.homePhcId,doctorId:dId,details:doc.name+' marked absent – '+(action.reason||'Not reported'),score:null};
      var att2=state.attendance.map(function(a){
        if(a.doctorId===dId)return Object.assign({},a,{status:'absent',leaveReason:action.reason||'Not reported'});
        return a;
      });
      return Object.assign({},state,{doctors:newDocs,phcs:newPhcs,attendance:att2,notifications:[newNotif].concat(state.notifications),auditLogs:[newLog].concat(state.auditLogs),aiPendingAbsent:dId,toastMsg:'Doctor marked absent. Alert sent to DDHS.'});
    }

    case'CHECK_IN':{
      var dId=action.doctorId;
      var t=new Date();
      var tStr=t.getHours()+':'+String(t.getMinutes()).padStart(2,'0')+' '+(t.getHours()>=12?'PM':'AM');
      var nd=state.doctors.map(function(d){return d.id===dId?Object.assign({},d,{status:'available',checkInTime:tStr,leaveReason:null}):d;});
      var doc2=nd.find(function(d){return d.id===dId;})||{};
      var np=state.phcs.map(function(p){
        if(p.id===doc2.currentPhcId){var od=p.doctorsOnDuty+1;return Object.assign({},p,{doctorsOnDuty:od,doctorsAbsent:Math.max(0,p.doctorsAbsent-1),status:computePHCStatus(Object.assign({},p,{doctorsOnDuty:od}))});}
        return p;
      });
      var att3=state.attendance.map(function(a){return a.doctorId===dId?Object.assign({},a,{status:'available',checkIn:tStr}):a;});
      return Object.assign({},state,{doctors:nd,phcs:np,attendance:att3,toastMsg:doc2.name+' checked in at '+tStr});
    }

    case'CHECK_OUT':{
      var dId=action.doctorId;
      var t2=new Date();
      var tStr2=t2.getHours()+':'+String(t2.getMinutes()).padStart(2,'0')+' '+(t2.getHours()>=12?'PM':'AM');
      var nd2=state.doctors.map(function(d){return d.id===dId?Object.assign({},d,{status:'checked-out',checkOutTime:tStr2}):d;});
      return Object.assign({},state,{doctors:nd2,toastMsg:'Checked out at '+tStr2});
    }

    case'APPROVE_SUBSTITUTE':{
      var subDocId=action.doctorId;
      var toPhcId=action.toPhcId;
      var subDoc=state.doctors.find(function(d){return d.id===subDocId;})||{};
      var fromPhcId=subDoc.homePhcId;
      var nd3=state.doctors.map(function(d){
        if(d.id===subDocId)return Object.assign({},d,{currentPhcId:toPhcId,isTemporarilyAssigned:true,assignedFromPhcId:fromPhcId,status:'available'});
        return d;
      });
      var np3=state.phcs.map(function(p){
        if(p.id===fromPhcId){var od=Math.max(0,p.doctorsOnDuty-1);return Object.assign({},p,{doctorsOnDuty:od,status:computePHCStatus(Object.assign({},p,{doctorsOnDuty:od}))});}
        if(p.id===toPhcId){var od2=p.doctorsOnDuty+1;var pw=Math.max(0,Math.round(p.patientsWaiting*0.82));var wt=Math.max(10,Math.round(p.avgWaitingTime*0.78));return Object.assign({},p,{doctorsOnDuty:od2,patientsWaiting:pw,avgWaitingTime:wt,status:computePHCStatus(Object.assign({},p,{doctorsOnDuty:od2,patientsWaiting:pw,avgWaitingTime:wt}))});}
        return p;
      });
      var asnId='ASN'+Date.now();
      var newAsn={id:asnId,doctorId:subDocId,fromPhcId:fromPhcId,toPhcId:toPhcId,date:'2026-09-22',startTime:'Just now',endTime:null,status:'active',approvedBy:(state.currentUser?state.currentUser.name:'DDHS'),aiScore:action.aiScore||0,reason:action.reason||'Doctor absence'};
      var nId2='N'+Date.now();
      var toPhc=state.phcs.find(function(p){return p.id===toPhcId;})||{};
      var newN={id:nId2,type:'assignment',title:'Assignment Approved – '+(toPhc.name||''),message:subDoc.name+' assigned. AI Score: '+((action.aiScore||0).toFixed(2))+'. Queue should reduce.',phcId:toPhcId,doctorId:subDocId,time:'Just now',read:false,severity:'info'};
      var alId2='AL'+Date.now();
      var newL={id:alId2,timestamp:'Just now',user:state.currentUser?state.currentUser.name:'DDHS',role:'DDHS',action:'Approved substitute doctor',phcId:toPhcId,doctorId:subDocId,details:subDoc.name+' assigned to '+(toPhc.name||'')+'. AI Score: '+((action.aiScore||0).toFixed(2)),score:action.aiScore||0};
      return Object.assign({},state,{doctors:nd3,phcs:np3,assignments:[newAsn].concat(state.assignments),notifications:[newN].concat(state.notifications),auditLogs:[newL].concat(state.auditLogs),aiPendingAbsent:null,toastMsg:'✓ '+subDoc.name+' successfully assigned!'});
    }

    case'CALL_NEXT_TOKEN':{
      var phcId=action.phcId;
      var q=state.queues[phcId];
      if(!q||q.tokens.length===0)return state;
      var nextTok=q.tokens[0];
      var remaining=q.tokens.slice(1);
      var newQ=Object.assign({},state.queues,{});
      newQ[phcId]={currentToken:nextTok,serving:nextTok,tokens:remaining};
      var np4=state.phcs.map(function(p){
        if(p.id===phcId){var pw=Math.max(0,p.patientsWaiting-1);var wt=Math.max(5,Math.round(p.avgWaitingTime*0.97));return Object.assign({},p,{patientsWaiting:pw,avgWaitingTime:wt,status:computePHCStatus(Object.assign({},p,{patientsWaiting:pw,avgWaitingTime:wt}))});}
        return p;
      });
      return Object.assign({},state,{queues:newQ,phcs:np4});
    }

    case'REGISTER_PATIENT':{
      var pid='SPHC-2026-'+String(state.patients.length+61).padStart(5,'0');
      var newPat=Object.assign({},action.patient,{id:pid,visitHistory:[],registeredPhcId:action.patient.phcId||'PHC001'});
      var alId3='AL'+Date.now();
      var newL2={id:alId3,timestamp:'Just now',user:state.currentUser?state.currentUser.name:'Staff',role:'PHC Staff',action:'Registered new patient',phcId:newPat.registeredPhcId,doctorId:null,details:'Patient '+pid+' registered',score:null};
      return Object.assign({},state,{patients:state.patients.concat([newPat]),auditLogs:[newL2].concat(state.auditLogs),toastMsg:'Patient '+pid+' registered successfully!'});
    }

    case'ADD_PHC':{
      var newP=action.phc;
      var newQueues=Object.assign({},state.queues);
      newQueues[newP.id]={currentToken:newP.currentToken||1,serving:newP.currentToken||1,tokens:[2,3,4]};
      var alIdPhc='AL'+Date.now();
      var newLogPhc={
        id:alIdPhc,
        timestamp:'Just now',
        user:state.currentUser?state.currentUser.name:'Administrator',
        role:state.currentUser?state.currentUser.role:'admin',
        action:'Added new PHC',
        phcId:newP.id,
        doctorId:null,
        details:'PHC '+newP.name+' ('+newP.taluk+') registered into district network',
        score:null
      };
      return Object.assign({},state,{
        phcs:state.phcs.concat([newP]),
        queues:newQueues,
        auditLogs:[newLogPhc].concat(state.auditLogs),
        toastMsg:'PHC '+newP.name+' added successfully!'
      });
    }

    case'UPDATE_MEDICINE_STOCK':{
      var mId=action.medicineId;
      var delta=action.delta;
      var nm=state.medicines.map(function(m){
        if(m.id===mId){
          var nq=Math.max(0,m.quantity+delta);
          var now2=new Date(2026,8,22);
          var ex=new Date(m.expiryDate);
          var df=(ex-now2)/(864e5);
          var st2=df<0?'expired':df<30?'near-expiry':nq<=0?'out-of-stock':nq<m.minStock?'low-stock':'available';
          return Object.assign({},m,{quantity:nq,status:st2});
        }
        return m;
      });
      return Object.assign({},state,{medicines:nm,toastMsg:'Medicine stock updated'});
    }

    case'UPDATE_AI_WEIGHTS':
      return Object.assign({},state,{aiWeights:action.weights,toastMsg:'AI weights updated successfully'});

    case'DISMISS_NOTIFICATION':
      return Object.assign({},state,{notifications:state.notifications.map(function(n){return n.id===action.id?Object.assign({},n,{read:true}):n;})});

    case'DISMISS_TOAST':
      return Object.assign({},state,{toastMsg:null});

    case'SET_PENDING_ABSENT':
      return Object.assign({},state,{aiPendingAbsent:action.doctorId});

    default:return state;
  }
}

window.AppReducer=reducer;

window.AppProvider=function AppProvider(props){
  var stateHook=R.useReducer(reducer,null,initialState);
  var state=stateHook[0];var dispatch=stateHook[1];
  R.useEffect(function(){
    if(state.toastMsg){
      var t=setTimeout(function(){dispatch({type:'DISMISS_TOAST'});},3500);
      return function(){clearTimeout(t);};
    }
  },[state.toastMsg]);
  return R.createElement(window.AppContext.Provider,{value:{state:state,dispatch:dispatch}},props.children);
};

console.log('[SmartPHC] Context layer loaded.');
})();
