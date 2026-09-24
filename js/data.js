// Smart PHC – Demo Data Layer
window.SPECIALIZATIONS = ['General Medicine','Paediatrics','Obstetrics & Gynaecology','Dental','AYUSH'];
window.TALUKS = ['Coimbatore North','Coimbatore South','Pollachi','Valparai','Mettupalayam','Kinathukadavu'];
window.DEMO_USERS = [
  {id:'DDHS001',email:'ddhs@coimbatore.gov.in',password:'Demo@1234',name:'Dr. K. Ramesh',role:'ddhs',phcId:null,avatar:'KR'},
  {id:'STF001',email:'staff@phckuniyamuthur.gov.in',password:'Demo@1234',name:'Nurse Lakshmi',role:'staff',phcId:'PHC001',avatar:'NL'},
  {id:'DOC002',email:'dr.arun@phcsinganallur.gov.in',password:'Demo@1234',name:'Dr. Arun Kumar',role:'doctor',phcId:'PHC002',avatar:'AK'},
  {id:'PAT001',email:'patient@demo.in',password:'Demo@1234',name:'Murugan R.',role:'patient',phcId:'PHC001',patientId:'SPHC-2026-00001',avatar:'MR'},
  {id:'ADM001',email:'admin@smartphc.gov.in',password:'Demo@1234',name:'System Admin',role:'admin',phcId:null,avatar:'SA'}
];
// PHC Data - 30 PHCs across 6 taluks
window.PHC_DATA = [
  {id:'PHC001',name:'PHC Kuniyamuthur',taluk:'Coimbatore North',location:'Kuniyamuthur Main Road, CBE',distanceFromHQ:4,doctorsAssigned:3,doctorsOnDuty:2,doctorsAbsent:1,patientsWaiting:38,avgWaitingTime:28,status:'moderate',medicineAlerts:1,currentToken:24,lastToken:38},
  {id:'PHC002',name:'PHC Singanallur',taluk:'Coimbatore North',location:'Singanallur Bus Stand, CBE',distanceFromHQ:7,doctorsAssigned:3,doctorsOnDuty:3,doctorsAbsent:0,patientsWaiting:22,avgWaitingTime:18,status:'normal',medicineAlerts:0,currentToken:31,lastToken:53},
  {id:'PHC003',name:'PHC Ganapathy',taluk:'Coimbatore North',location:'Ganapathy 3rd Street, CBE',distanceFromHQ:5,doctorsAssigned:3,doctorsOnDuty:3,doctorsAbsent:0,patientsWaiting:15,avgWaitingTime:12,status:'normal',medicineAlerts:0,currentToken:18,lastToken:33},
  {id:'PHC004',name:'PHC Ondipudur',taluk:'Coimbatore North',location:'Ondipudur Village, CBE',distanceFromHQ:9,doctorsAssigned:3,doctorsOnDuty:2,doctorsAbsent:1,patientsWaiting:65,avgWaitingTime:68,status:'critical',medicineAlerts:3,currentToken:12,lastToken:77},
  {id:'PHC005',name:'PHC Kovaipudur',taluk:'Coimbatore North',location:'Kovaipudur Main Road, CBE',distanceFromHQ:11,doctorsAssigned:3,doctorsOnDuty:3,doctorsAbsent:0,patientsWaiting:29,avgWaitingTime:24,status:'moderate',medicineAlerts:1,currentToken:20,lastToken:49},
  {id:'PHC006',name:'PHC Peelamedu',taluk:'Coimbatore South',location:'Peelamedu Airport Rd, CBE',distanceFromHQ:13,doctorsAssigned:3,doctorsOnDuty:3,doctorsAbsent:0,patientsWaiting:18,avgWaitingTime:15,status:'normal',medicineAlerts:0,currentToken:22,lastToken:40},
  {id:'PHC007',name:'PHC Saravanampatti',taluk:'Coimbatore South',location:'Saravanampatti Main St',distanceFromHQ:16,doctorsAssigned:3,doctorsOnDuty:2,doctorsAbsent:1,patientsWaiting:45,avgWaitingTime:40,status:'moderate',medicineAlerts:2,currentToken:15,lastToken:60},
  {id:'PHC008',name:'PHC Kalapatti',taluk:'Coimbatore South',location:'Kalapatti Village Road',distanceFromHQ:18,doctorsAssigned:3,doctorsOnDuty:3,doctorsAbsent:0,patientsWaiting:20,avgWaitingTime:16,status:'normal',medicineAlerts:0,currentToken:25,lastToken:45},
  {id:'PHC009',name:'PHC Sulur',taluk:'Coimbatore South',location:'Sulur Town Centre',distanceFromHQ:20,doctorsAssigned:3,doctorsOnDuty:1,doctorsAbsent:2,patientsWaiting:72,avgWaitingTime:75,status:'critical',medicineAlerts:4,currentToken:8,lastToken:80},
  {id:'PHC010',name:'PHC Thondamuthur',taluk:'Coimbatore South',location:'Thondamuthur Main Rd',distanceFromHQ:22,doctorsAssigned:3,doctorsOnDuty:3,doctorsAbsent:0,patientsWaiting:16,avgWaitingTime:13,status:'normal',medicineAlerts:0,currentToken:30,lastToken:46},
  {id:'PHC011',name:'PHC Pollachi North',taluk:'Pollachi',location:'Pollachi North Street',distanceFromHQ:45,doctorsAssigned:3,doctorsOnDuty:3,doctorsAbsent:0,patientsWaiting:25,avgWaitingTime:20,status:'normal',medicineAlerts:1,currentToken:18,lastToken:43},
  {id:'PHC012',name:'PHC Udumalpet',taluk:'Pollachi',location:'Udumalpet Town Rd',distanceFromHQ:40,doctorsAssigned:3,doctorsOnDuty:2,doctorsAbsent:1,patientsWaiting:35,avgWaitingTime:32,status:'moderate',medicineAlerts:1,currentToken:22,lastToken:57},
  {id:'PHC013',name:'PHC Anaimalai',taluk:'Pollachi',location:'Anaimalai Foothills Rd',distanceFromHQ:38,doctorsAssigned:3,doctorsOnDuty:3,doctorsAbsent:0,patientsWaiting:14,avgWaitingTime:10,status:'normal',medicineAlerts:0,currentToken:16,lastToken:30},
  {id:'PHC014',name:'PHC Kanjikode',taluk:'Pollachi',location:'Kanjikode Industrial Area',distanceFromHQ:42,doctorsAssigned:3,doctorsOnDuty:3,doctorsAbsent:0,patientsWaiting:19,avgWaitingTime:15,status:'normal',medicineAlerts:0,currentToken:28,lastToken:47},
  {id:'PHC015',name:'PHC Madukarai',taluk:'Pollachi',location:'Madukarai Town',distanceFromHQ:35,doctorsAssigned:3,doctorsOnDuty:2,doctorsAbsent:1,patientsWaiting:48,avgWaitingTime:44,status:'moderate',medicineAlerts:2,currentToken:14,lastToken:62},
  {id:'PHC016',name:'PHC Valparai',taluk:'Valparai',location:'Valparai Hill Station',distanceFromHQ:70,doctorsAssigned:3,doctorsOnDuty:3,doctorsAbsent:0,patientsWaiting:12,avgWaitingTime:10,status:'normal',medicineAlerts:0,currentToken:10,lastToken:22},
  {id:'PHC017',name:'PHC Sholayar',taluk:'Valparai',location:'Sholayar Dam Road',distanceFromHQ:78,doctorsAssigned:2,doctorsOnDuty:2,doctorsAbsent:0,patientsWaiting:8,avgWaitingTime:7,status:'normal',medicineAlerts:0,currentToken:6,lastToken:14},
  {id:'PHC018',name:'PHC Monkey Falls',taluk:'Valparai',location:'Monkey Falls Area',distanceFromHQ:72,doctorsAssigned:2,doctorsOnDuty:1,doctorsAbsent:1,patientsWaiting:62,avgWaitingTime:72,status:'critical',medicineAlerts:2,currentToken:5,lastToken:67},
  {id:'PHC019',name:'PHC Aliyar',taluk:'Valparai',location:'Aliyar Reservoir Road',distanceFromHQ:65,doctorsAssigned:3,doctorsOnDuty:3,doctorsAbsent:0,patientsWaiting:10,avgWaitingTime:8,status:'normal',medicineAlerts:0,currentToken:12,lastToken:22},
  {id:'PHC020',name:'PHC Ettikulam',taluk:'Valparai',location:'Ettikulam Village',distanceFromHQ:68,doctorsAssigned:2,doctorsOnDuty:2,doctorsAbsent:0,patientsWaiting:9,avgWaitingTime:7,status:'normal',medicineAlerts:0,currentToken:8,lastToken:17},
  {id:'PHC021',name:'PHC Mettupalayam',taluk:'Mettupalayam',location:'Mettupalayam Main Road',distanceFromHQ:50,doctorsAssigned:3,doctorsOnDuty:3,doctorsAbsent:0,patientsWaiting:22,avgWaitingTime:18,status:'normal',medicineAlerts:1,currentToken:20,lastToken:42},
  {id:'PHC022',name:'PHC Sirumugai',taluk:'Mettupalayam',location:'Sirumugai Foothills',distanceFromHQ:55,doctorsAssigned:3,doctorsOnDuty:2,doctorsAbsent:1,patientsWaiting:38,avgWaitingTime:35,status:'moderate',medicineAlerts:1,currentToken:16,lastToken:54},
  {id:'PHC023',name:'PHC Karamadai',taluk:'Mettupalayam',location:'Karamadai Town Centre',distanceFromHQ:48,doctorsAssigned:3,doctorsOnDuty:3,doctorsAbsent:0,patientsWaiting:17,avgWaitingTime:13,status:'normal',medicineAlerts:0,currentToken:24,lastToken:41},
  {id:'PHC024',name:'PHC Annur',taluk:'Mettupalayam',location:'Annur Main Road',distanceFromHQ:45,doctorsAssigned:3,doctorsOnDuty:3,doctorsAbsent:0,patientsWaiting:21,avgWaitingTime:17,status:'normal',medicineAlerts:0,currentToken:19,lastToken:40},
  {id:'PHC025',name:'PHC Chettipalayam',taluk:'Mettupalayam',location:'Chettipalayam Village',distanceFromHQ:52,doctorsAssigned:3,doctorsOnDuty:2,doctorsAbsent:1,patientsWaiting:40,avgWaitingTime:38,status:'moderate',medicineAlerts:2,currentToken:13,lastToken:53},
  {id:'PHC026',name:'PHC Kinathukadavu',taluk:'Kinathukadavu',location:'Kinathukadavu Main Road',distanceFromHQ:30,doctorsAssigned:3,doctorsOnDuty:3,doctorsAbsent:0,patientsWaiting:24,avgWaitingTime:19,status:'normal',medicineAlerts:0,currentToken:22,lastToken:46},
  {id:'PHC027',name:'PHC Madampatti',taluk:'Kinathukadavu',location:'Madampatti Village',distanceFromHQ:28,doctorsAssigned:3,doctorsOnDuty:3,doctorsAbsent:0,patientsWaiting:18,avgWaitingTime:14,status:'normal',medicineAlerts:1,currentToken:17,lastToken:35},
  {id:'PHC028',name:'PHC Idigarai',taluk:'Kinathukadavu',location:'Idigarai Road',distanceFromHQ:32,doctorsAssigned:3,doctorsOnDuty:2,doctorsAbsent:1,patientsWaiting:36,avgWaitingTime:34,status:'moderate',medicineAlerts:1,currentToken:15,lastToken:51},
  {id:'PHC029',name:'PHC Periyanaicken',taluk:'Kinathukadavu',location:'Periyanaickenpalayam Rd',distanceFromHQ:27,doctorsAssigned:3,doctorsOnDuty:3,doctorsAbsent:0,patientsWaiting:20,avgWaitingTime:16,status:'normal',medicineAlerts:0,currentToken:21,lastToken:41},
  {id:'PHC030',name:'PHC Irugur',taluk:'Kinathukadavu',location:'Irugur Airport Road',distanceFromHQ:25,doctorsAssigned:3,doctorsOnDuty:3,doctorsAbsent:0,patientsWaiting:15,avgWaitingTime:12,status:'normal',medicineAlerts:0,currentToken:18,lastToken:33}
];
// 90 Doctors (3 per PHC)
(function(){
var names=[
  ['Dr. Raj Kumar','General Medicine'],['Dr. Arun Kumar','General Medicine'],['Dr. Priya S.','Paediatrics'],
  ['Dr. Ravi M.','General Medicine'],['Dr. Kavya R.','General Medicine'],['Dr. Senthil K.','AYUSH'],
  ['Dr. Meena T.','Paediatrics'],['Dr. Anand B.','General Medicine'],['Dr. Sumitha L.','Dental'],
  ['Dr. Vignesh P.','General Medicine'],['Dr. Saranya K.','Obstetrics & Gynaecology'],['Dr. Karthik R.','Paediatrics'],
  ['Dr. Latha M.','General Medicine'],['Dr. Gopal S.','Dental'],['Dr. Nithya V.','AYUSH'],
  ['Dr. Suresh N.','General Medicine'],['Dr. Deepa R.','Paediatrics'],['Dr. Ramesh J.','General Medicine'],
  ['Dr. Vanitha S.','Obstetrics & Gynaecology'],['Dr. Balan T.','General Medicine'],['Dr. Indira K.','AYUSH'],
  ['Dr. Vijay A.','General Medicine'],['Dr. Parvathi M.','Dental'],['Dr. Chandran R.','General Medicine'],
  ['Dr. Usha S.','Paediatrics'],['Dr. Mani K.','General Medicine'],['Dr. Selvi T.','Obstetrics & Gynaecology'],
  ['Dr. Nathan B.','General Medicine'],['Dr. Malathy V.','AYUSH'],['Dr. Prasad R.','Dental'],
  ['Dr. Geetha M.','General Medicine'],['Dr. Venkat S.','Paediatrics'],['Dr. Chitra K.','General Medicine'],
  ['Dr. Ashok T.','Obstetrics & Gynaecology'],['Dr. Revathi N.','General Medicine'],['Dr. Kumar P.','AYUSH'],
  ['Dr. Radha S.','General Medicine'],['Dr. Balaji K.','Paediatrics'],['Dr. Suganya M.','General Medicine'],
  ['Dr. Prakash V.','Dental'],['Dr. Amala R.','General Medicine'],['Dr. Selvam T.','Obstetrics & Gynaecology'],
  ['Dr. Krishnan S.','General Medicine'],['Dr. Dhivya K.','Paediatrics'],['Dr. Pandian M.','AYUSH'],
  ['Dr. Yamini V.','General Medicine'],['Dr. Murugan T.','General Medicine'],['Dr. Rohini S.','Dental'],
  ['Dr. Senthilnathan K.','General Medicine'],['Dr. Prema R.','Paediatrics'],['Dr. Thilaga M.','Obstetrics & Gynaecology'],
  ['Dr. Annamalai T.','General Medicine'],['Dr. Kamala S.','AYUSH'],['Dr. Durai K.','General Medicine'],
  ['Dr. Shanthi V.','Paediatrics'],['Dr. Ganesh R.','General Medicine'],['Dr. Ponmani S.','Dental'],
  ['Dr. Lakshmi T.','General Medicine'],['Dr. Arjun K.','Obstetrics & Gynaecology'],['Dr. Malarvizhi N.','General Medicine'],
  ['Dr. Santhosh P.','AYUSH'],['Dr. Eswari M.','Paediatrics'],['Dr. Baskaran R.','General Medicine'],
  ['Dr. Kavitha S.','General Medicine'],['Dr. Sugumar K.','Dental'],['Dr. Dharani T.','Obstetrics & Gynaecology'],
  ['Dr. Palani M.','General Medicine'],['Dr. Subha V.','Paediatrics'],['Dr. Raman S.','AYUSH'],
  ['Dr. Devika K.','General Medicine'],['Dr. Arumugam T.','General Medicine'],['Dr. Sangeetha N.','Dental'],
  ['Dr. Moorthy R.','General Medicine'],['Dr. Hema S.','Obstetrics & Gynaecology'],['Dr. Shankar K.','General Medicine'],
  ['Dr. Pooja T.','Paediatrics'],['Dr. Babu M.','AYUSH'],['Dr. Sarathi R.','General Medicine'],
  ['Dr. Gowri S.','General Medicine'],['Dr. Rajkumar K.','Paediatrics'],['Dr. Nirmala T.','Dental'],
  ['Dr. Subramanian M.','General Medicine'],['Dr. Mythili S.','Obstetrics & Gynaecology'],['Dr. Marimuthu K.','General Medicine'],
  ['Dr. Sindhu R.','AYUSH'],['Dr. Jayaraman T.','General Medicine'],['Dr. Poorani S.','Paediatrics'],
  ['Dr. Ezhil M.','General Medicine'],['Dr. Vani K.','Obstetrics & Gynaecology'],['Dr. Tamizh S.','Dental']
];
var absentIdxs=[0,8,17,26,35,44,53,62,71,80];
var leaveIdxs=[8,44,80];
var delayedIdxs=[26,62];
var doctors=[];
var phcIds=window.PHC_DATA.map(function(p){return p.id;});
for(var i=0;i<90;i++){
  var phcId=phcIds[Math.floor(i/3)];
  var st=absentIdxs.indexOf(i)>=0?'absent':'available';
  if(leaveIdxs.indexOf(i)>=0)st='on-leave';
  if(delayedIdxs.indexOf(i)>=0)st='delayed';
  var hr=8+Math.floor(i/30);
  var mn=String((i*7)%60).padStart(2,'0');
  doctors.push({
    id:'DOC'+String(i+1).padStart(3,'0'),
    name:names[i][0],
    specialization:names[i][1],
    homePhcId:phcId,
    currentPhcId:phcId,
    phone:'98'+String(4000000+i*7654).slice(-8),
    email:names[i][0].toLowerCase().replace(/[^a-z]/g,'')+'@phc.gov.in',
    status:st,
    checkInTime:(st==='available'||st==='delayed')?(hr+':'+mn+' AM'):null,
    leaveReason:(st==='on-leave')?'Personal Leave':(st==='absent')?'Not reported':null,
    patientsServedToday:(st==='available')?5+(i%18):0,
    avgConsultationTime:8+(i%8),
    isTemporarilyAssigned:false,
    assignedFromPhcId:null
  });
}
doctors[0].name='Dr. Raj Kumar';doctors[0].specialization='General Medicine';doctors[0].status='absent';doctors[0].leaveReason='Leave';
doctors[1].name='Dr. Arun Kumar';doctors[1].specialization='General Medicine';doctors[1].status='available';doctors[1].checkInTime='08:42 AM';doctors[1].patientsServedToday=12;
doctors[2].name='Dr. Priya S.';doctors[2].specialization='Paediatrics';doctors[2].status='available';
doctors[3].name='Dr. Ravi M.';doctors[3].specialization='General Medicine';doctors[3].patientsServedToday=6;doctors[3].status='available';
doctors[4].name='Dr. Kavya R.';doctors[4].specialization='General Medicine';doctors[4].patientsServedToday=30;doctors[4].status='available';
window.DOCTORS_DATA=doctors;
console.log('[SmartPHC] Doctors loaded:',doctors.length);
})();
// Patients (60), Medicines (180), Queues, Attendance, Assignments, Audit Logs, Notifications
(function(){
var fNames=['Murugan','Selvi','Rajan','Kavitha','Arumugam','Geetha','Palani','Meena','Senthil','Valli','Balan','Sundari','Krishnan','Nalini','Maran','Kokilam','Shankar','Parvathi','Natesan','Kamala','Durai','Lakshmi','Anbu','Ponni','Selvam','Chitra','Nathan','Revathi','Gopal','Saranya','Vijay','Thilaga','Pandian','Yamini','Suresh','Deepa','Ramesh','Suganya','Karthik','Radha','Anand','Amala','Venkat','Rohini','Balaji','Devika','Santhosh','Shanthi','Ganesh','Malathy','Prasad','Rekha','Dinesh','Nithya','Muthupandi','Padmini','Saravanan','Jothi','Dhanapal','Poonkuzhali'];
var lNames=['R.','S.','K.','M.','T.','V.','P.','N.','A.','B.'];
var villages=['Kuniyamuthur','Singanallur','Ganapathy','Ondipudur','Kovaipudur','Peelamedu','Saravanampatti','Sulur','Pollachi','Annur'];
var diagnoses=['Fever and Cold','Hypertension','Diabetes follow-up','Viral infection','Back pain','Anemia','Respiratory infection','Skin rash','Headache','Gastritis'];
var phcIds=window.PHC_DATA.map(function(p){return p.id;});
var patients=[];
for(var i=0;i<60;i++){
  var phcId=phcIds[i%30];
  var visits=[];
  var nv=1+(i%4);
  for(var v=0;v<nv;v++){
    var d=new Date(2026,8,22-(v*30+i%15));
    visits.push({date:d.toLocaleDateString('en-IN'),phcId:phcId,doctorId:'DOC'+String((i%90)+1).padStart(3,'0'),doctorName:fNames[(i+v)%60],diagnosis:diagnoses[(i+v)%10],prescription:'Tab Paracetamol 500mg + Tab '+['Amoxicillin','Metformin','Amlodipine','Cetirizine'][v%4]+' as directed',token:10+(i%40)+v});
  }
  patients.push({id:'SPHC-2026-'+String(i+1).padStart(5,'0'),name:(fNames[i]||'Patient')+' '+lNames[i%10],dob:(1970+(i%50))+'-'+String(1+(i%12)).padStart(2,'0')+'-'+String(1+(i%28)).padStart(2,'0'),gender:(i%3===0)?'Female':'Male',phone:'97'+String(4000000+i*3211).slice(-8),village:villages[i%villages.length],emergencyContact:'98'+String(5000000+i*1234).slice(-8),registeredPhcId:phcId,visitHistory:visits});
}
window.PATIENTS_DATA=patients;

// Medicines (6 per PHC)
var medT=[
  {name:'Paracetamol 500mg',cat:'Analgesic',min:200},
  {name:'Amoxicillin 250mg',cat:'Antibiotic',min:100},
  {name:'Metformin 500mg',cat:'Antidiabetic',min:150},
  {name:'Amlodipine 5mg',cat:'Antihypertensive',min:100},
  {name:'ORS Sachets',cat:'Rehydration',min:50},
  {name:'Salbutamol Inhaler',cat:'Bronchodilator',min:20},
  {name:'Iron + Folic Acid Tabs',cat:'Nutritional',min:200},
  {name:'Vitamin C 500mg',cat:'Vitamin',min:100},
  {name:'Omeprazole 20mg',cat:'Antacid',min:100},
  {name:'Cetirizine 10mg',cat:'Antihistamine',min:100},
  {name:'Diclofenac 50mg',cat:'NSAID',min:100},
  {name:'Atorvastatin 10mg',cat:'Lipid-lowering',min:80},
  {name:'Doxycycline 100mg',cat:'Antibiotic',min:50},
  {name:'B-Complex Tabs',cat:'Vitamin',min:100},
  {name:'Calcium Carbonate 500mg',cat:'Mineral',min:100},
  {name:'Chlorphenamine 4mg',cat:'Antihistamine',min:100},
  {name:'Insulin 30/70 Vial',cat:'Antidiabetic',min:10},
  {name:'Ibuprofen 400mg',cat:'NSAID',min:100},
  {name:'Antacid Suspension',cat:'Antacid',min:20},
  {name:'Zinc Sulphate 20mg',cat:'Nutritional',min:50}
];
var meds=[];var mc=0;
var critPhcs=['PHC004','PHC009','PHC018'];
phcIds.forEach(function(phcId,pi){
  for(var m=0;m<6;m++){
    var t=medT[(pi*6+m)%medT.length];
    var forcedSt=null;
    if(phcId==='PHC004'&&m===0)forcedSt='low-stock';
    if(phcId==='PHC004'&&m===1)forcedSt='out-of-stock';
    if(phcId==='PHC004'&&m===2)forcedSt='near-expiry';
    if(phcId==='PHC009'&&m<2)forcedSt='out-of-stock';
    if(phcId==='PHC009'&&m===2)forcedSt='low-stock';
    if(phcId==='PHC009'&&m===3)forcedSt='low-stock';
    if(phcId==='PHC018'&&m===0)forcedSt='low-stock';
    if(phcId==='PHC018'&&m===1)forcedSt='near-expiry';
    if(phcId==='PHC007'&&m===0)forcedSt='low-stock';
    if(phcId==='PHC015'&&m===1)forcedSt='low-stock';
    var qty=forcedSt?(forcedSt==='out-of-stock'?0:forcedSt==='low-stock'?Math.floor(t.min*0.6):t.min*2.5):t.min*(2+(mc%4));
    var exMo=forcedSt==='near-expiry'?1:forcedSt==='expired'?-2:12+(mc%24);
    var exDate=new Date(2026,8+exMo,1);
    var now=new Date(2026,8,22);
    var diff=(exDate-now)/(864e5);
    var st=forcedSt||(diff<0?'expired':diff<30?'near-expiry':qty<=0?'out-of-stock':qty<t.min?'low-stock':'available');
    meds.push({id:'MED'+String(++mc).padStart(4,'0'),name:t.name,category:t.cat,batchId:'B'+phcId+String(m+1).padStart(2,'0'),quantity:Math.round(qty),minStock:t.min,expiryDate:(exDate.getMonth()+1)+'/'+exDate.getFullYear(),phcId:phcId,status:st});
  }
});
window.MEDICINES_DATA=meds;

// Queues
var queues={};
window.PHC_DATA.forEach(function(phc){
  var toks=[];for(var t=1;t<=Math.min(phc.patientsWaiting,8);t++)toks.push(phc.currentToken+t);
  queues[phc.id]={currentToken:phc.currentToken,serving:phc.currentToken,tokens:toks};
});
window.INITIAL_QUEUES=queues;

// Attendance
var att=[];
window.DOCTORS_DATA.forEach(function(doc,i){
  att.push({id:'ATT'+String(i+1).padStart(4,'0'),doctorId:doc.id,date:'2026-09-22',checkIn:doc.checkInTime||null,checkOut:null,status:doc.status,leaveReason:doc.leaveReason||null});
});
window.ATTENDANCE_DATA=att;

window.ASSIGNMENTS_DATA=[
  {id:'ASN001',doctorId:'DOC003',fromPhcId:'PHC003',toPhcId:'PHC004',date:'2026-09-22',startTime:'10:15 AM',endTime:null,status:'active',approvedBy:'Dr. K. Ramesh (DDHS)',aiScore:0.79,reason:'Doctor absence at PHC Ondipudur'}
];

window.AUDIT_LOGS_DATA=[
  {id:'AL001',timestamp:'2026-09-22 09:42 AM',user:'Dr. K. Ramesh',role:'DDHS',action:'Approved substitute doctor',phcId:'PHC004',doctorId:'DOC003',details:'Assigned Dr. Priya S. to PHC Ondipudur',score:0.79},
  {id:'AL002',timestamp:'2026-09-22 09:30 AM',user:'Nurse Lakshmi',role:'PHC Staff',action:'Marked doctor absent',phcId:'PHC001',doctorId:'DOC001',details:'Dr. Raj Kumar marked absent – Leave',score:null},
  {id:'AL003',timestamp:'2026-09-22 09:15 AM',user:'Dr. Arun Kumar',role:'Doctor',action:'Checked in',phcId:'PHC002',doctorId:'DOC002',details:'Check-in at 08:42 AM',score:null},
  {id:'AL004',timestamp:'2026-09-22 08:55 AM',user:'Nurse Lakshmi',role:'PHC Staff',action:'Registered new patient',phcId:'PHC001',doctorId:null,details:'Patient SPHC-2026-00061 registered',score:null},
  {id:'AL005',timestamp:'2026-09-22 08:50 AM',user:'System',role:'System',action:'Low stock alert generated',phcId:'PHC009',doctorId:null,details:'ORS Sachets stock below minimum',score:null},
  {id:'AL006',timestamp:'2026-09-21 05:15 PM',user:'Dr. K. Ramesh',role:'DDHS',action:'Updated AI weights',phcId:null,doctorId:null,details:'Specialization:40% Distance:30% Load:30%',score:null},
  {id:'AL007',timestamp:'2026-09-21 04:30 PM',user:'Dr. K. Ramesh',role:'DDHS',action:'Rejected substitute recommendation',phcId:'PHC018',doctorId:'DOC055',details:'Distance too far (78km). Chose nearby doctor.',score:0.55},
  {id:'AL008',timestamp:'2026-09-21 03:10 PM',user:'Dr. K. Ramesh',role:'DDHS',action:'Approved substitute doctor',phcId:'PHC018',doctorId:'DOC056',details:'Assigned Dr. Ganesh R. to PHC Monkey Falls',score:0.72},
  {id:'AL009',timestamp:'2026-09-21 02:00 PM',user:'Admin User',role:'Admin',action:'Added new doctor',phcId:'PHC025',doctorId:'DOC089',details:'Dr. Jayaraman T. added to PHC Chettipalayam',score:null},
  {id:'AL010',timestamp:'2026-09-21 11:30 AM',user:'Nurse Lakshmi',role:'PHC Staff',action:'Updated medicine stock',phcId:'PHC001',doctorId:null,details:'Paracetamol stock updated +500 units',score:null},
  {id:'AL011',timestamp:'2026-09-20 04:45 PM',user:'Dr. K. Ramesh',role:'DDHS',action:'Marked PHC critical',phcId:'PHC009',doctorId:null,details:'PHC Sulur flagged critical – 72 patients waiting',score:null},
  {id:'AL012',timestamp:'2026-09-20 03:30 PM',user:'System',role:'System',action:'Expiry alert generated',phcId:'PHC015',doctorId:null,details:'Amoxicillin 250mg near expiry (30 days)',score:null},
  {id:'AL013',timestamp:'2026-09-20 02:15 PM',user:'Dr. K. Ramesh',role:'DDHS',action:'Approved substitute doctor',phcId:'PHC022',doctorId:'DOC066',details:'Assigned Dr. Arumugam T. to PHC Sirumugai',score:0.68},
  {id:'AL014',timestamp:'2026-09-20 10:00 AM',user:'Admin User',role:'Admin',action:'Updated PHC details',phcId:'PHC017',doctorId:null,details:'PHC Sholayar location updated',score:null},
  {id:'AL015',timestamp:'2026-09-19 05:00 PM',user:'Dr. K. Ramesh',role:'DDHS',action:'Exported district report',phcId:null,doctorId:null,details:'Monthly report – September 2026',score:null},
  {id:'AL016',timestamp:'2026-09-19 03:45 PM',user:'Nurse Lakshmi',role:'PHC Staff',action:'Issued medicine',phcId:'PHC001',doctorId:null,details:'ORS Sachets – 15 packs issued',score:null},
  {id:'AL017',timestamp:'2026-09-19 02:00 PM',user:'Dr. K. Ramesh',role:'DDHS',action:'Approved substitute doctor',phcId:'PHC007',doctorId:'DOC022',details:'Dr. Parvathi M. assigned to PHC Saravanampatti',score:0.74},
  {id:'AL018',timestamp:'2026-09-18 04:30 PM',user:'Admin User',role:'Admin',action:'Configured system threshold',phcId:null,doctorId:null,details:'Low stock threshold set to 20% of minimum',score:null},
  {id:'AL019',timestamp:'2026-09-18 11:00 AM',user:'System',role:'System',action:'Out-of-stock alert generated',phcId:'PHC009',doctorId:null,details:'Insulin 30/70 out of stock',score:null},
  {id:'AL020',timestamp:'2026-09-17 05:00 PM',user:'Dr. K. Ramesh',role:'DDHS',action:'District status review',phcId:null,doctorId:null,details:'Monthly PHC status review completed',score:null}
];

window.NOTIFICATIONS_DATA=[
  {id:'N001',type:'absence',title:'Doctor Absent – PHC Kuniyamuthur',message:'Dr. Raj Kumar (General Medicine) is absent. Reason: Leave. PHC now has 2/3 doctors on duty.',phcId:'PHC001',doctorId:'DOC001',time:'09:10 AM',read:false,severity:'critical'},
  {id:'N002',type:'absence',title:'Doctor Absent – PHC Sulur',message:'Dr. Vanitha S. (Obstetrics & Gynaecology) absent. PHC Sulur has only 1 doctor on duty.',phcId:'PHC009',doctorId:'DOC019',time:'08:55 AM',read:false,severity:'critical'},
  {id:'N003',type:'absence',title:'Doctor Absent – PHC Monkey Falls',message:'Dr. Malathy V. (AYUSH) absent. PHC Monkey Falls has 1 doctor remaining.',phcId:'PHC018',doctorId:'DOC029',time:'08:40 AM',read:false,severity:'warning'},
  {id:'N004',type:'out-of-stock',title:'Out of Stock – PHC Sulur',message:'Insulin 30/70 (Vial) is OUT OF STOCK at PHC Sulur. Urgent restocking required.',phcId:'PHC009',doctorId:null,time:'08:30 AM',read:false,severity:'critical'},
  {id:'N005',type:'low-stock',title:'Low Stock – Amoxicillin 250mg',message:'Amoxicillin at PHC Ondipudur below minimum (60/100).',phcId:'PHC004',doctorId:null,time:'08:20 AM',read:true,severity:'warning'},
  {id:'N006',type:'low-stock',title:'Low Stock – ORS Sachets',message:'ORS Sachets at PHC Sulur below minimum. Current: 28/50.',phcId:'PHC009',doctorId:null,time:'08:15 AM',read:true,severity:'warning'},
  {id:'N007',type:'expiry',title:'Near Expiry – Paracetamol Batch',message:'Paracetamol at PHC Saravanampatti expires in 18 days.',phcId:'PHC007',doctorId:null,time:'Yesterday',read:true,severity:'warning'},
  {id:'N008',type:'high-queue',title:'High Queue – PHC Sulur',message:'Queue at PHC Sulur: 72 patients. Estimated wait: 75 minutes.',phcId:'PHC009',doctorId:null,time:'Yesterday',read:true,severity:'critical'},
  {id:'N009',type:'high-queue',title:'High Queue – PHC Ondipudur',message:'Queue at PHC Ondipudur: 65 patients. Average wait 68 minutes.',phcId:'PHC004',doctorId:null,time:'Yesterday',read:false,severity:'critical'},
  {id:'N010',type:'critical-phc',title:'Critical Status – PHC Monkey Falls',message:'PHC Monkey Falls CRITICAL. 1 doctor on duty, 62 patients waiting (72 min avg).',phcId:'PHC018',doctorId:null,time:'Yesterday',read:false,severity:'critical'},
  {id:'N011',type:'pending-approval',title:'Pending: Substitute Doctor Needed',message:'PHC Kuniyamuthur requires a substitute for Dr. Raj Kumar. 5 candidates ranked.',phcId:'PHC001',doctorId:'DOC001',time:'09:12 AM',read:false,severity:'warning'},
  {id:'N012',type:'assignment',title:'Assignment Completed – PHC Ondipudur',message:'Dr. Priya S. successfully assigned to PHC Ondipudur. AI Score: 0.79.',phcId:'PHC004',doctorId:'DOC003',time:'09:45 AM',read:true,severity:'info'},
  {id:'N013',type:'low-stock',title:'Low Stock – Iron + Folic Acid',message:'Iron + Folic Acid at PHC Madukarai below minimum. Current: 85/200.',phcId:'PHC015',doctorId:null,time:'Yesterday',read:true,severity:'warning'},
  {id:'N014',type:'expiry',title:'Near Expiry – Amoxicillin Batch',message:'Amoxicillin at PHC Madukarai expires in 25 days. Use FEFO protocol.',phcId:'PHC015',doctorId:null,time:'2 days ago',read:true,severity:'warning'},
  {id:'N015',type:'out-of-stock',title:'Out of Stock – PHC Ondipudur',message:'Amoxicillin 250mg out of stock at PHC Ondipudur. Immediate resupply needed.',phcId:'PHC004',doctorId:null,time:'Yesterday',read:true,severity:'critical'}
];

window.AI_WEIGHTS_DEFAULT={specialization:40,distance:30,patientLoad:30};
console.log('[SmartPHC] Full data layer loaded. PHCs:',window.PHC_DATA.length,'Doctors:',window.DOCTORS_DATA.length,'Patients:',window.PATIENTS_DATA.length,'Medicines:',window.MEDICINES_DATA.length);
})();
