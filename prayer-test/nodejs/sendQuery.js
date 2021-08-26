#!/usr/bin/env nodejs

var https = require('https');
var tools = require('./tools');
var security = require("./security");
const url = require('url');
var nodemailer = require('nodemailer');
var moment = require('moment');
var fs = require('fs');

var root = "/var/www/html";
var home = root + "/prayer";
const argv = require('minimist')(process.argv.slice(2));
var queryObject = {};
var thing = argv["_"];;
var env = "prod";

let date_ob = new Date();

// current date
// adjust 0 before single digit date
let date = ("0" + date_ob.getDate()).slice(-2);
// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
// current year
let year = date_ob.getFullYear();
// current hours
let hours = date_ob.getHours();
// current minutes
let minutes = date_ob.getMinutes();
// current seconds
let seconds = date_ob.getSeconds();

fs.appendFile(home + '/nodejs/log.txt', year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds + " " + thing+"\n", function (err) {
    if (err) { console.log("error"); return console.log(err); }
});

fs.appendFile(home + '/nodejs/log.txt', year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds + " " + thing+"\n", function (err) {
    if (err) { console.log("error"); return console.log(err); }
});

// correction for requestText, which comes in with commas (don't know why!)
var requestText = "";
var paramString = thing.join(",");
var firstPart = paramString.split("requestText=");

if (firstPart.length > 1) {
    firstPart = firstPart[1];
    var secondPart = firstPart.split("categoryId");
    requestText = secondPart[0];
    requestText = requestText.split(",").join(" ");
}

fs.appendFile(home + '/nodejs/log.txt', year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds + " " + requestText +"\n", function (err) {
    if (err) { console.log("error"); return console.log(err); }
});

for (var i = 0; i < thing.length; i++) {
    var param = thing[i];
    var params = param.split("=");
    queryObject[params[0]] = params[1];
}

if (queryObject["command"] == "previewPrayer" && requestText) queryObject["requestText"] = requestText;

if (__filename.includes("prayer-test")) {
    env = "test";
    home = root + "/prayer-test";
}

function log(message) {
    fs.writeFile(home + '/log.txt', message, function (err) {
	if (err) return console.log(err);
    });
}

function requireParam(param) {
    if (param == "userId" && env == "test") {
	queryObject["userId"] = 105; // pireifej user
	return;
    }
    if (!queryObject[param]) {
	var obj = {};
	obj["result"] = param + " is required";
	console.log(JSON.stringify(obj));
	process.exit();
    }
}

function createPool() {
    try {
	const mariadb = require('mariadb');

	const pool = mariadb.createPool({
	    host: 'localhost',
	    user: 'pireifej',
	    password: 'Armani2362!',
	    database: 'god',
	    connectionLimit: 10,
	    waitForConnections: true,
	    queueLimit: 0,
	    multipleStatements: true
	});

	return pool;
    } catch (error) {
	return console.log(`Could not connect - ${error}`);
    }
}

var categories = {
    "healing": ['curative','therapeutic','healthful','remedial','alterative','sanative','healer','recovery','therapy','curing','reconciliation','mend','recuperation','rehabilitation','soothing','cure','scarring','calming','treatment','medicinal','regeneration','treating','wellness','reparation','restoration','medicine','care','conciliation','repair','pacification','easing','wound','redress','calm','reinstatement','retrieval','convalescent','surgeon','retrieving','appeasement','dressing','appeasing','infirmary','showcase','sanitation','de-escalation','re-establishment','resourcing','self-awareness','self-healing','wholeness','cleansing','spirituality','meditation','rejuvenation','peruvian balsam','salve','forgiveness','intercessory','reiki','magick','exfoliation','detoxification','balm','recuperative','brokenness','purification','aromatherapy','kundalini','regrowth','rolfing','arnica montana','reflexology','deliverance','mediumship','physical therapy','overcomer','repentance','indwelling','poultice','transfiguring','systematic desensitization','meditational','purgation','massage','herbalism','awakening','attunement','metta','sanctification','arnica','mindfulness','centredness','drugless','acupressure','catharsis','salvific','moxa','prayer','centeredness'],
    'surgery': ['surgical procedure','operation','operating room','operating theater','operating theatre','surgical operation','surgeon','surgeons','surgical','surgically','procedure','implant','outpatient','physician','plastic','infirmary','bypass','mammary','intervention','decking','cosmetology','operations','knife','exercise','pad','speech','action','regina','transaction','bloc','operating','response','involvement','chirurgie','interventions','block','reconstructive','skin graft','hysterectomy','microsurgery','arthroscopy','hernia','craniotomy','abdominoplasty','mastectomy','liposuction','neurosurgery','rhinoplasty','maxillofacial','endoscopy','otoplasty','prostatectomy','incision','anesthesia','resection','reconstructive surgery','appendectomy','radical hysterectomy','transplant','skin grafting','tonsillectomy','splenectomy','angioplasty','colectomy','herniated disc','ligament','coronary bypass surgery','laparotomy','corneal transplant','biopsy','tummy tuck','radical mastectomy','amputation','epidural injection','coronary bypass','cyst','laminectomy','detached retina','catheterization','neuroplasty','cholecystectomy','lobectomy','lumpectomy','labrum','rotator cuff','gall bladder','physical therapy','doctors','tracheotomy','blood clot','heart surgeon','stress fracture','tendon','umbilical hernia','colonoscopy','gastrectomy','meniscectomy','thyroidectomy','hamstring tendon','nephrectomy'],
    'family': ['house','kinfolk','home','kin','household','kinsfolk','fellowship','class','folk','menage','category','sept','family line','family unit','kinsperson','phratry','relatives','siblings','father','wife','clan','parents','uncles','community','familial','life','children','caring','breadwinner','child','brood','caregiver','married','fam','homes','marital','parent','familie','marriage','kinship','relative','familia','dependents','dynasty','cottage','lineage','couple','surname','genealogical','foster','matrimonial','parental','parenting','households','parenthood','homey','casa','care','housework','captivity','portfolio','progeny','close','patronymic','domestic','relatedness','famille','folks','descent','carnival','plans','countries','plan','prisoner','range','dependency','pedigree','captives','ilk','foyer','tribunal','array','secret','gamut','spectrum','system','prisoners','last','familiar','scheme','grouping','series','the','capture','schemes','tribunals','captured','dependants','fvi','hogar'],
    'pet': ['ducky','deary','loved','favorite','dearie','positron emission tomography','preferred','favourite','favored','darling','dog','puppy','cat','pooch','animal','doggie','pup','doggy','animals','kitten','kitty','toy','bird','livestock','baby','companion','turtle','companionship','lapdog','mascot','cute','household','peeve','peeves','domestic','honey','cosset','friend','boy','beast','dear','bug','sweetheart','small','ornamental','spoon','hat','silly','tame','little','fart','enchanting','pocket','popular','poof','dumb','animalistic','plaything','caress','stupid','beautiful','cabbage','favoured','company','fondle','pretty','spectator','stroke','familiar','chip','spit','tep','polyethylene','toe','cer','tec','trp','puff','compagnie','fdg','bang','journeyman','positron','societal','tomography','kennel','beagle','chihuahua','golden retriever','pug','dachshund','basset hound','shetland sheepdog','veterinarian','hamster','french bulldog','great dane','poodle','schnauzer','lhasa apso'],
    'love': ['passion','enjoy','beloved','dear','dearest','lovemaking','honey','loved one','making love','sexual love','adore','hate','affection','adores','cherish','romance','friendship','devotion','beautiful','liked','lover','admire','lovey','fondness','romantic','fond','appreciate','goodness','admiration','wanna','know','kindness','want','lovers','sweetie','compassion','liking','heaven','feelings','kiss','valentine','favorite','bless','adorable','pleasure','sweet','kisses','affinity','god','sweetheart','nice','like','caring','conquers','cares','hobby','ardor','prefer','hug','tenderness','enjoyed','desires','eros','likes','babe','caritas','amour','amor','enjoying','sake','heart','treasure','sympathy','enjoys','feeling','crying','amity','taste','sakes','emotional','crush','darling','sick','patriotic','girl','eff','sex','fancies','amore','chuckles','noah','christ','bonk','angel','flame','favourite','care','wants','jazz','worships'],
    'life': ['lifetime','living','aliveness','lifespan','biography','sprightliness','spirit','liveliness','animation','life story','life history','lifestyle','society','family','lifestyles','career','lifelong','lifetimes','death','livelihood','survival','existence','soul','human','personal','eternity','longevity','health','reclusion','imprisonment','vitality','learning','live','time','mortality','die','way','experience','future','birth','zest','souls','always','reality','breath','world','breathing','biological','cycle','sciences','daily','story','fate','hell','history','day','age','people','span','flora','skin','insurance','subsistence','expectancy','sphere','term','coexistence','vest','kill','lifeblood','alive','vivacity','person','welfare','fauna','autonomy','property','perpetuity','vital','psychosocial','biology','liv','killing','activity','scene','course','perpetual','days','privacy','leben','vida','perpetua','lifeline','discussion','vigor','vita','anima','period','debate','duration'],
    'children': ['kids','parents','toddlers','daughters','mothers','preschoolers','teenagers','siblings','orphans','infants','grandchildren','babies','youngsters','families','schoolchildren','adolescents','sons','youths','tots','infant','girls','boys','people','pupils','son','ages','kiddies','baby','childhood','students','boy','youth','childcare','offspring','young','juveniles','persons','age','family','pediatric','them','kid','education','males','births','schoolboys','pupil','dependents','pediatrics','those','clothes','juvenile','minors','paediatric','dears','student','clothing','enfants','paediatrics','unicef','infancy','babes','lads','they','secondary','bambino','infantile','miners','underage','descendants','barns','enfant','guys','male','less','burdens','barn','beau','peeps','minor','kinder','reduced','subjection','nino','the','lower','lowest','organization','lesser','child-care','childhoods','ciac','dependants','enfance','infantil','jeunesse','niño','under-age','tong','adult'],
    'hope': ['promise','desire','trust','go for','hopeful','hopefully','believe','wish','chance','want','optimism','expect','pray','think','urge','expectation','aim','opportunity','belief','vow','confidence','intend','faith','wishing','aspire','wants','wishes','wait','wished','despair','wanted','await','dream','look','waiting','aspirations','expects','anticipate','ask','illusion','aspiration','omen','urged','better','expectancy','luck','attempt','lot','like','desirous','expectations','anticipation','prospect','perspective','rely','augur','anticipates','call','count','vote','sing','trusts','deferred','mma','span','bob','hoppe','reb','amal','hoop','esperanza','espoir','espérance','expectancies','esperance','mel','mul','simpson','glad','someday','happy','feel','glimmer','try','fear','need','strive','thankful','implore','confident','wanhope','say','convinced','grateful','insist','surely','rejoice','worry','positiveness','regret'],
    'inspiration': ['brainchild','stirring','inhalation','breathing in','encouragement','muse','inspire','impetus','motivation','imagination','spirit','enlightenment','enthusiasm','vision','beacon','aspiration','palette','guide','example','impulse','momentum','breath','idea','goddess','important','guidance','hint','incentive','model','centrepiece','impression','revelation','emulation','breathing','stimulus','basis','suggestion','creativity','passion','joy','creativeness','wisdom','artistry','ingenuity','spirituality','inspirationist','solace','theopneusted','wellspring','entheal','entheastic','mentor','inspirable','admiration','touchstone','interspiration','courage','homage','sustenance','encourager','sketch pad','catalyst','love','inbreathe','metaphor','springboard','nourishment','devotion','reverence','genius','overcomer','motivator','exemplar','pride','greatness','succor','uplifting','michelangelesque','indomitability','spiritally','epiphany','leitmotif','tirelessness','zest','oneirocriticism','perseverance','timelessness','spark','transcendentalist','pathognomy','ideas','boundlessness','resonance','thrill','afflation','vivaciousness','kindness','admirer','idol','inventiveness'],
    'marriage': ['matrimony','wedding','wedlock','married couple','union','man and wife','marriage ceremony','marry','marrying','married','divorce','wed','marital','remarriage','matrimonial','bride','prenup','spousal','conjugal','weddings','spouse','wife','husband','polygyny','knot','brides','intermarriage','couple','family','matchmaking','alliance','mating','household','ceremony','match','marie','martial','anniversary','celebration','pair','affinity','meager','combination','torque','blend','common-law','zakon','nuptials','cohabitation','monogamy','betrothal','serial monogamy','decree absolute','premarital','decree nisi','infidelity','parenthood','fatherhood','courtship','marital status','bigamy','banns','civil marriage','adelphogamy','open marriage','dismarry','group marriage','marriage of convenience','mariage','monandry','sponsal','couples','deuterogamy','digamist','newlyweds','bachelorhood','solemnisation','romance','digamy','polygamize','digamous','elopement','misogamist','bedswerver','loveless','polygamy','unfaithfulness','divorcees','sororate','marriable','adultery','solemnization','monogyny','alimony','polyandry','procreative','relationship','community property','platonic','confarreation'],
    'travel': ['trip','journey','jaunt','go','move','locomotion','change of location','locomote','travelers','trips','journeys','flights','traveler','itinerary','cruise','fly','vacation','commuting','sightseeing','hitchhike','destination','commute','transportation','flight','depart','accommodation','trek','transport','excursions','tourism','fare','passengers','ride','outbound','excursion','ticket','visa','freight','visit','honeymoon','holiday','passport','rides','leave','tourist','route','voyages','voyage','passenger','hospitality','transporting','road','sail','tours','tourists','shipping','traffic','traverse','visitor','relocation','tour','come','transit','navigate','touring','air','travellers','relocate','enter','roam','mobility','haulage','migrate','transports','voyager','reimbursement','reach','carriers','drive','get','moving','navigation','walk','browse','departure','transfer','cross','make','walking','circulate','borrow','town','wend','proceed','racing','moves','surrender','entry','touristic','way'],
    'strength': ['potency','durability','persuasiveness','intensity','effectiveness','force','forte','forcefulness','specialty','metier','speciality','enduringness','lastingness','long suit','military capability','strong point','resilience','resiliency','strong','toughness','stamina','fortitude','prowess','tenacity','solidity','firmness','determination','vigor','superiority','momentum','dynamism','courage','depth','clout','robustness','ability','strengthening','resilient','endurance','muscle','vitality','closeness','stature','skill','success','elasticity','decisiveness','strengthen','solid','presence','backbone','stability','soundness','hardness','capability','robust','steadfastness','power','hardiness','vibrancy','importance','concentration','talent','pressure','advantages','weight','resistance','powerful','size','stiffness','leverage','extent','advantage','capacity','cogency','steam','severity','reinforcement','bravery','edge','rigor','powerhouse','vehemence','influence','reliability','numbers','stringency','impetus','powers','validity','value','level','reluctance','virtue','stress','dynamic','energy','horsepower','incumbency','complement'],
    'peace': ['peace treaty','serenity','peacefulness','public security','repose','heartsease','ataraxis','peace of mind','peacemaking','reconciliation','truce','tranquility','peaceful','peacemakers','concord','harmony','pacification','stability','appeasement','peacemaker','freedom','peacefully','peacekeeping','peacekeepers','pacifist','calmness','paix','settlement','political','calm','salaam','security','salam','quiet','islam','lull','quietness','paz','silence','process','pacific','sholom','safely','peacetime','missions','order','anger','keeping','anthem','rest','consolation','outrage','hoping','fred','degree','push','wrath','break','pace','activities','alone','ciao','pushing','mier','tranquillity','staircase','taiping','level','operations','rate','capc','ladder','delivered','freds','brasileiro','dpko','frieden','pacifica','peace-loving','peacebuilding','pso','ceasefire','mir','ping','disarmament','unity','nonviolence','amity','coexistence','prosperity','shalom','happiness','oneness','contentment','democracy','rapprochement','peace conference','democratic','pacificator','disengagement'],
    'leaders': ['leadership','officials','representatives','politicians','chiefs','governments','presidents','policymakers','commanders','executives','chieftains','governors','dignitaries','summit','statesmen','champions','elites','elders','chairmen','rulers','spokespersons','administrators','spokesmen','luminaries','bosses','cadres','entrepreneurs','officers','unionists','managers','elite','authorities','captains','principals','heads','commander','men','leading','governing','pioneers','managements','monarchs','owners','ceos','makers','supervisors','bellwethers','chefs','personalities','superiors','presenters','princes','masters','drivers','commandos','figures','facilitator','caucuses','chief','directors','nobles','warlords','protagonists','frameworks','noblemen','captain','moguls','senior','lords','management','officer','command','leads','accountable','bearers','executive','responsibility','chairs','guides','direction','fuhrer','lead','commands','head','formers','counts','guiding','arrows','chef','responsible','charge','vips','ceo','animators','chairpersons','discussants','facilitators','frontrunners','führer','leadership'],
    'finances': ['funds','cash in hand','monetary resource','pecuniary resource','financial','financially','budgets','budget','auditors','coffers','fiscal','funding','comptroller','financials','resources','accounts','bankrolls','revenues','economies','economically','treasury','exchequers','economics','exchequer','appropriations','households','pays','subsidizes','underwrites','means','supports','hacienda','chests','debt','balance sheet','solvency','economy','purse strings','creditworthiness','borrowing','bookkeeping','cashflow','auditor','spending','pension','outgoings','insolvency','dealings','cash flow','checkbook','treasurer','fisc','relations','economic','expenditures','credit','assets','welfare','incomes','indebtedness','refinancing','accountant','credit crunch','loans','money','payroll','endowments','audit','expenses','recession','affairs','stockholdings','disbursements','pocketbooks','mismanagement','liquidity','trustees','fortunes','troubles','investments','payments','ledgers','spendthrift','governance','relationship','mortgage','footing','liabilities','taxpayers','shortfalls','receipts','unsecured debt','cutbacks','credibility','stewardship','savings','health','business','repayment','disposable income'],
    'salvation': ['redemption','savior','forgiveness','reincarnation','liberation','lifeline','rescuer','rescuing','rescue','saving','saved','rescuers','relief','solution','hallo','salvage','rescued','rescues','save','bailout','howdy','hey','cheerio','hiya','bye','goodbye','soup','victoria','ticket','salut','greeting','greetings','saviour','release','hello','welcome','heil','salvo','drawee','salute','hail','resort','blaze','bail-out','bye-bye','deliverance','resurrection','salvific','righteousness','repentance','sanctification','holiness','god','atonement','blessedness','divine','redeemer','messiah','heaven','sinner','faith','sin','damnation','perdition','transcendence','beatitude','enlightenment','immortality','terminism','prophets','eternal damnation','absolution','providence','lovingkindness','metanoia','wholeness','faithfulness','lowliness','fulness','apostles','prophecy','koinonia','transubstantiation','transfiguration','godhood','gnosis','eschaton','souls','exaltation','samsara','oblation','afterlife','apostle paul','purgation','disciples','perfectibility','sonship','eternities','heathenism','littleness'],
    'emotion': ['emotional','excitement','sadness','sorrow','passion','compassion','indignation','affection','fervor','sympathy','emotive','feeling','sense','thrill','outrage','sentiment','shock','mood','feel','consternation','distress','commotion','turmoil','heart','upset','upheaval','unrest','movement','stir','agitation','microchip','chip','cit','grief','empathy','anguish','pathos','anger','frustration','angst','jealousy','anxiety','emotionality','feelings','emotionalist','elation','pathognomy','exuberance','emotional state','sentimentality','joy','adrenaline','tears','affectuous','remorse','sobs','enthusiasm','despair','dejection','emotionalism','adrenalin','incredulousness','negativity','bitterness','exhilaration','poignancy','jubilation','dispathy','bravado','wistfulness','histrionics','psychological state','bashfulness','instinct','melancholy','heartbreak','soulfulness','sarcasm','laughter','nervousness','spontaneity','exultation','nuance','cognitive state','anxiousness','peevishness','impassionable','hopefulness','theatrics','pensiveness','joviality','rawness','sombreness','anthropopathy','aloneness','nerves','joyousness','positiveness','bewilderment','nostalgia'],
    'sexual': ['intersexual','intimate','unisexual','sexy','sexed','sex','intercourse','lewd','sexuality','erotic','carnal','heterosexual','genital','indecent','pornographic','pornography','sexualized','reproductive','gender','obscene','sexist','harassment','mating','impotence','dishonest','nature','provokes','vice','character','nationality','naturalization','infections','representativeness','citizenship','the','rogue','csec','gamic','statelessness','homosexual','nonsexual','bisexual','sadomasochistic','extramarital','gay','lustful','kinky','homoerotic','lesbian','psychosexual','sensual','male','raunchy','porn','sex act','sexual relation','erotographomania','amphigony','amphigenesis','consensual','anisogamous','amphigonic','lascivious','antiaphrodisiac','esexual','sexualist','suggestive','psychosexual development','sex organ','monandrous','erotopathy','transexion','sexual intercourse','amorous','protandric','criminal conversation','heterogamous','genophobia','carnal knowledge','venereous','algophilia','digenesis','algolagnic','putage','procreative','autoerotic','dirty old man','flirtatious','sex object','libidinosity','cacogenic','vaginal','sexual arousal','inappropriate','digenetic','prurient','open marriage','lustless','licentious','adolescent'],
    'drugs': ['dose','do drugs','medications','medicines','narcotics','pills','painkillers','narcotic','medication','stimulants','substances','meds','dope','prescriptions','therapies','treatments','medicine','pharmaceuticals','pharmaceutical','medicinal','substance','sedatives','illicit','medicaments','addicts','sedates','addictions','pharmacy','inhibitors','addiction','intoxicants','doping','herbs','cures','downers','medical','remedies','abuse','dopes','products','product','poisonous','supplies','expensive','use','drogue','anti-drug','antimicrobials','cox-2','drogues','drug-free','hopheads','immunosuppressants','roofies','scrips','heroin','cocaine','methadone','amphetamines','methamphetamine','ketamine','dextroamphetamine','cocain','morphine','opiates','methylenedioxymethamphetamine','ecstasy','cannabis','psychoactive substance','antianxiety drug','methaqualone','meth','prescription drug','pimozide','narcan','anticonvulsants','alcohol','imuran','ketamine hydrochloride','pentazocine','antidepressant','nardil','temazepam','mdma','fentanyl','dilaudid','diacetylmorphine','ephedrine','prescription','coricidin','retrovir','pethidine','oxazepam','booze','dronabinol','triazolam','molindone','marijuana','chlordiazepoxide','tranquillizer'],
    'suicide': ['felo-de-se','self-annihilation','self-destruction','suicidal','homicide','death','bomb','bombing','martyrdom','attack','bombers','terrorist','bomber','kamikaze','kill','explosion','martyr','attacker','commando','fedayeen','madness','guerrilla','ideation','overkill','car','throat','jumper','sacrificial','terminator','slaughterhouse','booby-trapped','fedayee','one-way','self-immolation','self-inflicted','suicidality','commit suicide','murder','filicide','assassination','violence','arson','fatality','overdose','rape','tragedy','murderer','alcoholism','crime','seppuku','terror','victimization','suicide bombing','felo de se','suicide bomber','uxoricide','bombings','crime of passion','sororicide','shootings','depression','attacks','spree killer','murderee','drownings','psychiatric','mental illness','abduction','bomb blast','cruentation','murther','slaying','kidnapping','immolation','vaticide','drowning','mentally ill','killing','psychiatrists','stillbirth','parasuicide','suist','hijacking','mactation','mental health','suicism','thanatosis','foeticide','put to death','miscarriage','ptsd','defunction','assaults','clinical depression','deadlihood','posttraumatic stress disorder','drygulch','femicide','suicidology','blasts'],
    'pain': ['anguish','painfulness','hurting','annoyance','hurt','trouble','botheration','afflict','ail','bother','nuisance','pain in the ass','pain in the neck','painful sensation','discomfort','ache','agony','soreness','anxiety','heartache','trauma','grief','painful','headache','sore','suffering','nausea','hardship','misery','torment','distress','tenderness','heartbreak','injury','sorrow','sadness','affliction','analgesic','analgesia','hurts','painkiller','bitterness','woe','burden','torments','inconvenience','loss','sting','harm','difficulty','balm','damage','relaxation','regret','ordeal','bereavement','wound','sympathy','misfortune','sufferance','plight','sacrifice','prejudice','punishment','pity','bedside','squirm','bad','thorn','undesirability','time','aggrieve','wrong','grievance','sentencing','tolerance','ill','badly','weak','death','lot','touch','penalty','mother','umma','worth','sentence','evil','poorly','loaf','arrears','mal','boring','backlog','maternal','beard','motherland','term','spite','smart']
};

var allCommands = {
    "previewPrayer": true,
    "passwordChange": true,
    "getPrayerCount": true,
    "deletePrayer": true,
    "getPrayer": true,
    "deleteRequest": true,
    "getRequest": true,
    "getMyRequests": true,
    "getNotifications": true,
    "getRequestFeed": true,
    "getCategories": true,
    "login": true,
    "getUser": true,
    "getThisUser": true,
    "getAllUsers": true,
    "updateUser": true,
    "help": true,
    "email": true,
    "forgotPassword": true,
    "getPrayerHistory": true,
    "getPeopleWhoPrayed": true,
    "createUser": true,
    "createRequest": true,
    "prayFor": true,
    "getAllPrayers": true,
    "readPrayer": true,
    "getTemp": true,
    "updatePrayer": true,
    "createPrayer": true,
    "joinRosarySession": true,
    "leaveRosarySession": true,
    "getRosarySession": true,
    "logVisitor": true
};

if (!queryObject["command"]) {
    printAllCommands();
}

function printAllCommands() {
    for (var key in allCommands) {
	console.log(key);
    }
}

requireParam("command");

if (!allCommands[queryObject["command"]]) {
    printAllCommands();
}

//https.createServer(options, function (request, response) {
//    const queryObject = url.parse(request.url,true).query;
var command = queryObject.command;
var tz = queryObject.tz;
var query = null;
var readFile = null;

if (command == "logVisitor") {
    requireParam("details");

    query = "INSERT INTO visitors (visitor_details) VALUES (";
    query += "'" + queryObject.details + "')";
}

if (command == "getPrayerCount") {
    query = "SELECT COUNT(*) ";
    query += " FROM user_request ";
    query += " WHERE user_id = " + queryObject["userId"];
}

if (command == "getAllPrayers") {
    query = "SELECT * ";
    query += "FROM prayers ";
    query += "WHERE prayers.active = 1;";
}

if (command == "deletePrayer") {
    requireParam("prayerName");
    query = "DELETE FROM prayers WHERE prayer_file_name='" + queryObject.prayerName + "';";
}

if (command == "createPrayer") {
    requireParam("prayerText");
    requireParam("prayerTags");
    requireParam("prayerTitle");
    requireParam("prayerName");
    requireParam("categoryId");

    query = "INSERT INTO prayers (prayer_title, prayer_file_name, fk_category_id, tags, prayer_text) VALUES (";
    query += "'" + queryObject.prayerTitle + "',";
    query += "'" + queryObject.prayerName + "',";
    query += "'" + queryObject.categoryId + "',";
    query += "'" + queryObject.prayerTags + "',";
    query += "'" + queryObject.prayerText + "');";
}

if (command == "updatePrayer") {
    requireParam("prayerId");
    requireParam("prayerName");

    var prayerText = queryObject["prayerText"];
    var prayerTags = queryObject["prayerTags"];
    var prayerTitle = queryObject["prayerTitle"];
    var prayerName = queryObject["prayerName"];
    var prayerId = queryObject["prayerId"];
    var categoryId = queryObject["categoryId"];

    query = "UPDATE prayers ";
    query += "SET prayer_file_name = '" + prayerName + "' ";
    if (categoryId) query += ", fk_category_id = '" + categoryId + "' ";
    if (prayerTags) query += ", tags = '" + prayerTags + "' ";
    if (prayerTitle) query += ", prayer_title = '" + prayerTitle + "' ";
    if (prayerText) query += ", prayer_text = '" + prayerText + "' ";
    query += "WHERE prayer_id = '" + prayerId + "'";
}

if (command == "readPrayer") {
    requireParam("fileName");

    query = "SELECT prayer_text ";
    query += "FROM prayers ";
    query += "WHERE prayer_file_name='" + queryObject.fileName + "';";
}

if (command == "previewPrayer") {
    requireParam("userId");
    requireParam("requestText");

    query = "SELECT user.real_name,user.gender ";
    query += "FROM user ";
    query += "WHERE user.user_id = '" + queryObject.userId + "';";

    query += "SELECT prayers.tags,prayers.prayer_file_name,prayers.prayer_title ";
    query += "FROM prayers; ";

    const pool = createPool();
    module.exports = pool;
    pool.getConnection()
        .then(conn => {
            conn.query(query)
                .then((rows) => {
		    var user = rows[0][0];
		    var obj = {};
		    var gender = user.gender;
		    var realName = user.real_name;
		    var otherPerson = queryObject["otherPerson"];
		    var requestText = queryObject.requestText;
		    var prayers = rows[1];

		    var bestPrayerObj = getBestPrayer(prayers, requestText);
		    var bestPrayer = bestPrayerObj.result;
		    var scores = bestPrayerObj.scores;

		    fs.readFile(home + '/prayers/' + bestPrayer, 'utf8', function (err, data) {
			if (err) {
			    console.log("Error");
			    console.log(err);
			    return;
			}

			var customPrayer = generateCustomPrayer(data, realName, gender, otherPerson);
			obj["result"] = {prayer:customPrayer,scores:scores};
			obj["query"] = query;
//			console.log(JSON.stringify(obj));
			conn.release();
			conn.end();
//			process.exit();
			return;
		    })
		})
	    	.catch(err => {
                    console.log("not connected due to error: " + err);
                    var obj = {};
                    obj["result"] = err;
                    obj["query"] = query;
                    console.log(JSON.stringify(obj));
                    conn.release();
                    conn.end();
                    process.exit();
                })
	});
    return;
}

if (command == "getPrayer") {
    requireParam("requestId");

    var debug = (queryObject["debug"]) ? queryObject.debug : false;

    query = "SELECT user.real_name,user.gender,";
    query += "request.request_text,request.other_person,request.request_id,request.request_title,request.picture,request.fk_prayer_id,prayers.prayer_text,prayers.prayer_title,CONVERT_TZ(request.timestamp,'GMT','" + queryObject.tz + "') as timestamp ";
    query += "FROM request INNER JOIN user INNER JOIN prayers ";
    query += "WHERE user.user_id = request.user_id ";
    query += "AND prayers.prayer_id = request.fk_prayer_id ";
    query += "AND request.request_id = '" + queryObject.requestId + "';";

/*    query += "SELECT prayers.tags,prayers.prayer_file_name,prayers.prayer_title,prayers.prayer_id,prayer_text ";
    query += "FROM prayers ";
    query += "WHERE prayers.active = 1;";
*/
    const pool = createPool();
    module.exports = pool;
    pool.getConnection()
        .then(conn => {
            conn.query(query)
                .then((rows) => {
		    var requestText = "";
		    var realName = "";
		    var gender = "";
		    var otherPerson = "";
		    var prayerId = "";
		    var selectedPrayerFileName = "";

//		    var request = rows[0][0];
//		    var prayers = rows[1];
		    var request = rows[0];

		    if (request.length > 0) {
			requestText = request.request_text
			realName = request.real_name;
			gender = request.gender;
			otherPerson = request.other_person;
			prayerId = request.fk_prayer_id;

		/*	for (var i = 0; i < prayers.length; i++) {
			    if (prayers[i].prayer_id == prayerId) {
				selectedPrayerFileName = prayers[i].prayer_file_name;
			    }
			}
		*/
		    }

		    if (debug) {
			console.log("request text");
			console.log(requestText);
		    }

/*
		    const rake = require('node-rake');
		    const myKeywords = rake.generate(requestText);
		    const datamuse = require('datamuse');
		    if (debug) {
			console.log("keywords...");
			console.log(myKeywords);
		    }
*/
		    // https://www.npmjs.com/package/parts-of-speech
/*		    var chosen = myKeywords[0];
		    var pos = require('pos');
		    for (var i = 0; i < myKeywords.length; i++) {*/
			// phrase has priority
/*			if (myKeywords[i].split(" ").length > 1) {
			    chosen = myKeywords[i];
			    var phraseWords = chosen.split(" ");
			    for (var j = 0; j < phraseWords.length; j++) {
				var words = new pos.Lexer().lex(phraseWords[j].toLowerCase());
				var tagger = new pos.Tagger();
				var taggedWords = tagger.tag(words);
				for (k in taggedWords) {
				    var taggedWord = taggedWords[k];
				    var word = taggedWord[0];
				    var tag = taggedWord[1];
				    if (debug) console.log("got phrase:" + word + " /" + tag);
				    if (tag == "VB" || tag == "VBN") {
					chosen = word;
					break;
				    }
				    // adjective has priority
				    if (tag == "JJ") {
					chosen = word;
					break;
				    }
				}
			    }
			}
			var words = new pos.Lexer().lex(myKeywords[i].toLowerCase());
			var tagger = new pos.Tagger();
			var taggedWords = tagger.tag(words);
			for (j in taggedWords) {
			    var taggedWord = taggedWords[j];
			    var word = taggedWord[0];
			    var tag = taggedWord[1];
			    if (tag == "VB" || tag == "VBN") {
				chosen = word;
				break;
			    }
			    // adjective has priority
			    if (tag == "JJ") {
				chosen = word;
				break;
			    }
			    if (debug) console.log("regular:" + word + " /" + tag);
			}
		    }

		    if (debug) console.log("chosen word = " + chosen);
*/		    
/*		    datamuse.words({
			ml: "chosen"
		    })
			.then((json) => {
			    var keywords = {};
			    for (var i = 0; i < json.length; i++) {
				keywords[json[i].word] = true;
			    }
			    var score = {};
			    for (var key in categories) {
				score[key] = 0;
			    }
			    for (var key in categories) {
				for (var i = 0; i < categories[key].length; i++) {
				    if (keywords[categories[key][i]]) score[key]++;
				}
			    }
			    if (debug) console.log(score);

			    const max = Object.keys(score).reduce((a, v) => Math.max(a, score[v]), -Infinity);
			    const result = Object.keys(score).filter(v => score[v] === max);

		    	    var bestPrayerObj = { result: result[0]+"1", scores: score, title: "general" };
			    var bestPrayer = bestPrayerObj.result;
			    var scores = bestPrayerObj.scores;
			    scores["chosen"] = chosen;
			    var title = bestPrayerObj.name;
*/
			    // don't use logic to select best prayer, just select assigned prayer
//			    if (selectedPrayerFileName) {
//				bestPrayer = selectedPrayerFileName;
//				title = "Prayer Title";
//			    }

		    // if prayerId exists, pick that bestPrayer prayer name
		    var scores = {};
		    var otherPerson = request.other_person;
		    var realName = request.real_name;
		    
		    if (!request.prayer_text) {
			var obj = {};
			obj["result"] = {};
			obj["result"]["prayer_title"] = request.request_title;
			obj["result"]["prayer_text"] = "No prayer assigned yet";
			obj["result"]["request"] = request;
			obj["result"]["query"] = query;
			obj["result"]["scores"] = scores;
			console.log(JSON.stringify(obj));
			conn.release();
			conn.end();
			process.exit();
			return;
		    }
		    
		    var customPrayer = generateCustomPrayer(request.prayer_text, realName, gender, otherPerson);
			    var obj = {};
			    obj["result"] = {};
			    obj["result"]["prayer_title"] = request.request_title;
			    obj["result"]["prayer_text"] = customPrayer;
			    obj["result"]["request"] = request;
			    obj["result"]["query"] = query;
			    obj["result"]["scores"] = scores;
			    console.log(JSON.stringify(obj));
			    conn.release();
			    conn.end();
			    process.exit();
			    return;
			})
			.catch(err => {
			    console.log("not connected due to error: " + err);
			    var obj = {};
			    obj["result"] = err;
			    obj["query"] = query;
			    console.log(JSON.stringify(obj));
			    conn.release();
			    conn.end();
			    process.exit();
			})
	});
//	});
    return;
}

if (command == "deleteRequest") {
    query = "UPDATE request ";
    query += "SET active = FALSE ";
    query += "WHERE request_id = '" + queryObject.requestId + "'";
}

if (command == "joinRosarySession") {
    requireParam("userId");
    requireParam("sessionId");
    
    query = "INSERT INTO rosary (session_id, fk_user_id) VALUES(";
    query += "'" + queryObject.sessionId + "',";
    query += "'" + queryObject.userId + "');";
}

if (command == "leaveRosarySession") {
    requireParam("userId");
    requireParam("sessionId");
    
    query = "UPDATE rosary ";
    query += "SET session_id = NULL ";
    query += "WHERE fk_user_id = '" + queryObject.userId + "' ";
    query += "AND session_id = '" + queryObject.sessionId + "';";
}

if (command == "getRosarySession") {
    requireParam("sessionId");

    query = "SELECT user.real_name,rosary.fk_user_id,CONVERT_TZ(rosary.timestamp,'GMT','" + queryObject.tz + "') as timestamp ";
    query += "FROM rosary ";
    query += "INNER JOIN user ON user.user_id = fk_user_id ";
    query += "WHERE session_id='" + queryObject.sessionId + "';";
}

if (command == "getRequest") {
    requireParam("requestId");

    query = "SELECT request_id,request_text,request_title,request.picture as request_picture,category.category_name,user.user_name,user.picture,user.real_name,CONVERT_TZ(request.timestamp,'GMT','" + queryObject.tz + "') as timestamp ";
    query += "FROM request ";
    query += "INNER JOIN category ON category.category_id = fk_category_id ";
    query += "INNER JOIN user ON user.user_id = request.user_id ";
    query += "WHERE request_id = '" + queryObject.requestId + "'; ";
}

if (command == "getMyRequests") {
    requireParam("userId");

    query = "SELECT request.request_id,request.user_id,request_text,request_title,picture as request_picture,category.category_name,CONVERT_TZ(timestamp,'GMT','" + queryObject.tz + "') as timestamp, ";
    query += "(SELECT COUNT(*) FROM user_request WHERE user_request.request_id = request.request_id) as prayer_count ";
    query += "FROM request INNER JOIN category ON category.category_id = fk_category_id ";
    query += "WHERE request.user_id = '" + queryObject.userId + "' and request.active is TRUE ";
    query += "ORDER BY timestamp DESC";
/*    
    query += "SELECT user.picture,user.real_name,user.user_name,user_request.user_id,user_request.request_id,user_request.timestamp, ";
    query += "FROM user_request INNER JOIN user ";
    query += "ON user.user_id = user_request.user_id ";
    query += "WHERE request_id=" + queryObject.requestId;
*/
}

if (command == "getNotifications") {
    query = "SELECT user.real_name, request.request_title,user_request.user_id, request.request_id, user.picture, CONVERT_TZ(user_request.timestamp,'GMT','" + queryObject.tz + "') as timestamp ";
    query += "FROM request INNER JOIN user_request ON user_request.request_id = request.request_id INNER JOIN user on user.user_id = user_request.user_id ";
    query += "WHERE request.user_id = '" + queryObject.userId + "' AND request.active = 1 ";
    query += "ORDER BY user_request.timestamp DESC ";
    query += "LIMIT 3;";
}

if (command == "getRequestFeed") {
    var requestId = (queryObject["requestId"]) ? queryObject["requestId"] : null;
    query = "SELECT request_id,request.user_id,request_text,request_title,request.picture as request_picture,request.other_person,category.category_name,CONVERT_TZ(request.timestamp,'GMT','" + queryObject.tz + "') as timestamp,user.real_name,user.picture, ";
    query += "(SELECT COUNT(*) FROM user_request WHERE user_request.request_id = request.request_id) as prayer_count ";
    query += "FROM request INNER JOIN category ON category.category_id = fk_category_id ";
    query += "INNER JOIN user ON user.user_id = request.user_id ";
    // only active prayers
    query += "WHERE request.active IS TRUE ";
    // get a specific request only
    if (requestId) {
	query += "AND request.request_id = " + requestId + " ";
    }
    // not your request
    //query += "AND (request.user_id <> '" + queryObject.userId + "' OR request.other_person <> '') ";
    // you already prayed
    query += "AND request.request_id NOT IN ";
    query += "(SELECT request_id FROM user_request WHERE user_request.user_id = '" + queryObject.userId + "') ";
    query += "ORDER BY timestamp DESC";
}

if (command == "getCategories") {
    query = "SELECT category_id, category_name ";
    query += "FROM category ";
    query += "WHERE active is TRUE";
}

if (command == "login") {
    requireParam("userName");
    requireParam("password");
    
    query = "SELECT password,user_name,email,real_name,user_title,user_about,location,active,timestamp,user_id,picture ";
    query += "FROM user WHERE user_name = '" + queryObject.userName + "' ";
    query += "LIMIT 1;";

    const pool = createPool();
    module.exports = pool;
    pool.getConnection()
	.then(conn => {
	    conn.query(query)
		.then((rows) => {
		    var obj = {};
		    var hash = rows[0].password;
		    delete rows[0]["password"];
		    obj["result"] = rows;
		    obj["query"] = query;

		    if (!obj["result"]) {

		    } else {
			var bcrypt = require('bcrypt');
			bcrypt.compare(queryObject.password, hash, function(err, result) {
			    if (err) {
				obj["result"] = err;
			    }
			    if (!result) {
				obj["result"] = result;
			    }
				       
			    console.log(JSON.stringify(obj));
			    conn.release();
			    conn.end();
			    process.exit();
			    return;
			});
		    }
		})
		.catch(err => {
		    console.log("not connected due to error: " + err);
		    var obj = {};
		    obj["result"] = err;
		    obj["query"] = query;
		    console.log(JSON.stringify(obj));
		    conn.release();
		    conn.end();
		    process.exit();
		});
	});
    return;
}

if (command == "getUser") {
    query = "SELECT user_id,user_name,email,real_name,location,user_title,user_about,picture,CONVERT_TZ(timestamp,'GMT','" + queryObject.tz + "') as timestamp ";
    query += "FROM user WHERE user_id = '" + queryObject.userId + "';";
}

if (command == "getThisUser") {
    query = "SELECT user_name,email,real_name,location,user_title,user_about,picture,CONVERT_TZ(timestamp,'GMT','" + queryObject.tz + "') as timestamp ";
    query += "FROM user WHERE user_id = '" + queryObject.thisUserId + "';";
}

if (command == "getAllUsers") {
    query = "SELECT user_id,user_name,picture ";
    query += "FROM user";
}

if (command=="passwordChange") {
    requireParam("password");
    requireParam("userId");

    var mypassword = queryObject.password;
    var bcrypt = require('bcrypt');
    const saltRounds = 5;
   
    bcrypt.hash(mypassword, saltRounds, function(err, hash) {
	var password = hash;
	query = "UPDATE user ";
	query += "SET password = '" + password + "' ";
	query += "WHERE user_id = '" + queryObject.userId + "';";

	const pool = createPool();
	module.exports = pool;
	pool.getConnection()
	    .then(conn => {
		conn.query(query)
		    .then((rows) => {
			var obj = {};
			obj["result"] = rows;
			obj["query"] = query;
			console.log(JSON.stringify(obj));
			conn.release();
			conn.end();
			process.exit();
		    })
	    })
	    .catch(err => {
		console.log("not connected due to error: " + err);
		var obj = {};
		obj["result"] = err;
		obj["query"] = query;
		console.log(JSON.stringify(obj));
		conn.release();
		conn.end();
		process.exit();
	    });
    });
}

if (command == "getTemp") {
    var max = 10;
    var temp = (Math.random() * (99 - 97.9) + 97.9).toFixed(2);
    var obj = {};
    obj["result"] = temp;
    console.log(JSON.stringify(obj));
    process.exit();
}

if (command == "updateUser") {
    requireParam("userId");
    var queryParts = [];

    if (queryObject["userName"]) {
	queryParts.push("user_name = '" + queryObject.userName + "'");
    }
    if (queryObject["email"]) {
	queryParts.push("email = '" + queryObject.email + "'");
    }
    if (queryObject["realName"]) {
	queryParts.push("real_name = '" + queryObject.realName + "'");
    }
    if (queryObject["location"]) {
	queryParts.push("location = '" + queryObject.location + "'");
    }
    if (queryObject["title"]) {
	queryParts.push("user_title = '" + queryObject.title + "'");
    }
    if (queryObject["picture"]) {
	queryParts.push("picture = '" + queryObject.picture + "'");
    }
    if (queryObject["about"]) {
	queryParts.push("user_about = '" + queryObject.about + "'");
    }

    if (queryParts.length > 0) {
	query = "UPDATE user SET " + queryParts.join(",") + " WHERE user_id = '" + queryObject.userId + "';";
    }
}

if (command == "help") {
    var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
	    user: 'pireifej@gmail.com',
	    pass: 'bcvbfcsvklsnegqc'
	}
    });
    
    var mailOptions = {
	from: 'welcome@prayforus.com',
	subject: queryObject.subject,
	text: "Message : " + queryObject.message + "\n" +
	    "Email: " + queryObject.email + "\n" +
	    "User ID: " + queryObject.userId + "\n" +
	    "Name: " + queryObject.name + "\n"
    };

    mailOptions["to"] = "pireifej@gmail.com";
    transporter.sendMail(mailOptions, function(error, info) {
	if (error) {
	    var obj = {};
	    obj["result"] = 'Error: ' + error;
	    obj["query"] = "No Query";
	    console.log(JSON.stringify(obj));
	    process.exit();
	    return;
	} else {
	    var obj = {};
	    obj["result"] = 'Email sent: ' + info.response;
	    obj["query"] = "No Query";
	    console.log(JSON.stringify(obj));
	    process.exit();
	    return;
	}
    });
}

if (command == "email") {
    var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
	    user: 'pireifej@gmail.com',
	    pass: 'bcvbfcsvklsnegqc'
	}
    });
    
    var mailOptions = {
	from: 'welcome@prayforus.com',
	subject: 'Welcome to the Prayer Network, ' + queryObject.realName + '!',
	text: 'Thanks for joining, ' + queryObject.realName + '! Try to login and start praying.'
    };

    mailOptions["to"] = queryObject.email;
    transporter.sendMail(mailOptions, function(error, info){
	if (error) {
	    var obj = {};
	    obj["result"] = 'Error: ' + error;
	    obj["query"] = "No Query";
	    console.log(JSON.stringify(obj));
	    process.exit();
	    return;
	} else {
	    var obj = {};
	    obj["result"] = 'Email sent: ' + info.response;
	    obj["query"] = "No Query";
	    console.log(JSON.stringify(obj));
	    process.exit();
	    return;
	}
    });
}

if (command == "forgotPassword") {
    var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
	    user: 'pireifej@gmail.com',
	    pass: 'bcvbfcsvklsnegqc'
	}
    });
    
    var mailOptions = {
	from: 'welcome@prayforus.com',
	subject: 'Welcome to the Prayer Network, ' + queryObject.realName + '!',
	text: 'Thanks for joining, ' + queryObject.realName + '! Try to login and start praying.'
    };

    mailOptions["to"] = queryObject.email;
    transporter.sendMail(mailOptions, function(error, info){
	if (error) {
	    var obj = {};
	    obj["result"] = 'Error: ' + error;
	    obj["query"] = "No Query";
	    console.log(JSON.stringify(obj));
	    process.exit();
	    return;
	} else {
	    var obj = {};
	    obj["result"] = 'Email sent: ' + info.response;
	    obj["query"] = "No Query";
	    console.log(JSON.stringify(obj));
	    process.exit();
	    return;
	}
    });
}

// determine best prayer to use
function getBestPrayer(prayers, requestText) {
    // init tags hash
    var tags = {};
    var prayerNames = {};

    // store each prayer tag into 'fileName' --> 'tags list' hash
    for (var i = 0; i < prayers.length; i++) {
	var fileName = prayers[i].prayer_file_name;
	var prayerTags = prayers[i].tags;
	var prayerName = prayers[i].prayer_title;
	if (!prayerTags) continue;
	tags[fileName] = {};
	prayerNames[fileName] = prayerName;

	prayerTags = prayerTags.split(",");
	for (var j = 0; j < prayerTags.length; j++) {
	    tags[fileName][prayerTags[j].toLowerCase()] = true;
	}
    }

    // store each request word into hash
    var words = {};
    var requestWords = requestText.split(" ");

    const rake = require('node-rake');
    const myKeywords = rake.generate(requestText);

    const datamuse = require('datamuse');
    for (var i = 0; i < myKeywords.length; i++) {
	console.log(myKeywords[i]);
	getLikeWords(myKeywords[i]);
    }

    if (requestWords.length == 1) {
	requestWords = requestText.split("%20");
    }

    for (var i = 0; i < requestWords.length; i++) {
	words[requestWords[i].toLowerCase()] = true;
    }

    // perform scoring
    var scores = {};
    for (var prayerName in tags) {
	if (!scores[prayerName]) scores[prayerName] = 0;

	var myTags = tags[prayerName];
	for (var tag in myTags) {
	    if (words[tag]) {
		scores[prayerName]++;
	    }
	}
    }

    var allZeroes = true;
    for (var key in scores) {
	if (scores[key] > 0) {
	    allZeroes = false;
	}
    }

    var finalPrayer = "general1";
    if (!allZeroes) {
	const max = Object.keys(scores).reduce((a, v) => Math.max(a, scores[v]), -Infinity);
	const result = Object.keys(scores).filter(v => scores[v] === max);
	finalPrayer = result[0];
    }

    var prayerTitle = prayerNames[finalPrayer];
    return {result:finalPrayer,scores:scores,name:prayerTitle};
}

function getLikeWords(phrase) {
    const datamuse = require('datamuse');
    console.log("================="+phrase+"=====================");
     datamuse.words({
	ml: phrase
    })
	.then((json) => {
	    console.log(json);
	    //do it!
	});
}

function generateCustomPrayer(prayerText, realName,gender,otherPerson) {
    const genderDetect = require('gender-detection');

    // is this prayer for someone else?
    // CODE IN PROGRESS
    /*
      var x = require('people-names');
      var words = requestText.split(" ");
      var newText = "";
      var subject = "";
      for (var i = 0; i < words.length; i++) {
      var txt = words[i];
      newText = txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      if (x.isPersonName(newText)) {
      subject = newText;
      }
      }
      console.log(subject);
      
      realName = (subject) ? subject : realName;
    */

    realName = (otherPerson) ? otherPerson : realName;

    if (!gender) {
	gender = genderDetect.detect(realName);
    }

    var hisOrHer = (gender == "male") ? "his" : "her";
    var heOrShe = (gender == "male") ? "he" : "she";
    var himOrHer = (gender == "male") ? "him" : "her";
    
    prayerText = prayerText.replace(/{{name}}/g, realName);
    prayerText = prayerText.replace(/{{gender1}}/g, hisOrHer);
    prayerText = prayerText.replace(/{{gender2}}/g, heOrShe);
    prayerText = prayerText.replace(/{{gender3}}/g, himOrHer);

    return prayerText;
}

function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
	response = {};

    if (matches.length !== 3) {
	return new Error('Invalid input string');
    }

    var type = matches[1];
    var fileType = type.split("/")[1];
    response.type = fileType;
    response.data = new Buffer(matches[2], 'base64');

    return response;
}

if (command == "getPrayerHistory") {
    requireParam("userId");
    
    query = "SELECT user.real_name,user.picture,request.request_title,request.request_text ";
    query += "FROM user_request INNER JOIN request ON request.request_id = user_request.request_id ";
    query += "INNER JOIN user on user.user_id = request.user_id ";
    query += "WHERE user_request.user_id=" + queryObject.userId;
}

if (command == "getPeopleWhoPrayed") {
    requireParam("requestId");
    
    query = "SELECT user.picture,user.real_name,user.user_name,user_request.user_id,user_request.request_id,user_request.timestamp ";
    query += "FROM user_request INNER JOIN user ";
    query += "ON user.user_id = user_request.user_id ";
    query += "WHERE request_id IN (" + queryObject.requestId + ")";
}

if (command == "createUser") {
    requireParam("userName");
    requireParam("password");
    requireParam("email");
    requireParam("realName");
    requireParam("location");
    requireParam("title");
    requireParam("about");
    requireParam("picture");
    requireParam("gender");
    requireParam("phone");

    var mypassword = queryObject.password;
    var bcrypt = require('bcrypt');
    const saltRounds = 5;

    bcrypt.hash(mypassword, saltRounds, function(err, hash) {
	var password = hash;
	query = "INSERT INTO user (user_name, password, email, real_name, location, user_title, user_about, picture, gender, phone, active) VALUES (";
	query += "'" + queryObject.userName + "',";
	query += "'" + password + "',";
	query += "'" + queryObject.email + "',";
	query += "'" + queryObject.realName + "',";
	query += "'" + queryObject.location + "',";
	query += "'" + queryObject.title + "',";
	query += "'" + queryObject.about + "',";
	query += "'" + queryObject.picture + "',";
	query += "'" + queryObject.gender + "',";
	query += "'" + queryObject.phone + "',";
	query += "TRUE);";

	const pool = createPool();
	module.exports = pool;
	pool.getConnection()
	    .then(conn => {
		conn.query(query)
		    .then((rows) => {
			var obj = {};

			if (mypassword == "facebook") {
			    obj["output"] = env;
			    obj["result"] = 'facebook user created';
			    obj["query"] = query;
			    console.log(JSON.stringify(obj));
			    process.exit();
			    conn.release();
			    conn.end();
			    return;
			}

			var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
				user: 'pireifej@gmail.com',
				pass: 'bcvbfcsvklsnegqc'
                            }
			});

			fs.readFile(home + '/nodejs/welcomeEmailTemplate.html', 'utf8', function (err,data) {
			    if (err) {
				console.log(err);
				return;
			    }

			    data = data.replace("{{realName}}", queryObject.realName);
			    data = data.replace("{{userName}}", queryObject.userName);
			    
			    var mailOptions = {
				from: 'pireifej@gmail.com',
				to: queryObject.email,
				bcc: "pireifej@gmail.com",
				subject: "Welcome to Pray For Us!",
				html: data
			    };

			    transporter.sendMail(mailOptions, function(error, info) {
				if (error) {
				    var obj = {};
				    obj["result"] = 'Error: ' + error;
				    obj["query"] = "No Query";
				    console.log(JSON.stringify(obj));
				    process.exit();
				    return;
				} else {
				    var obj = {};
				    obj["output"] = env;
				    obj["result"] = 'Email sent: ' + info.response;
				    obj["query"] = "No Query";
				    console.log(JSON.stringify(obj));
				    process.exit();
				    conn.release();
				    conn.end();
				    return;
				}
			    });
			})
		    })
		    .catch(err => {
			var obj = {};
			obj["result"] = err;
			obj["query"] = query;
			console.log(JSON.stringify(obj));
			conn.release();
			conn.end();
			process.exit();
		    });
	    });
	return;
    })
}

if (command == "createRequest") {
    requireParam("userId");
    requireParam("requestText");
    requireParam("requestTitle");
    requireParam("requestCategoryId");
    requireParam("sendEmail");
    requireParam("preview");
    requireParam("prayerId");

    var preview = queryObject.preview;

    if (preview == "false") active = "TRUE";
    else active = "FALSE";
    
    query = "INSERT INTO request (user_id, request_text, request_title, fk_category_id, other_person, picture, fk_prayer_id, active) VALUES (";
    query += "'" + queryObject.userId + "',";
    query += "'" + queryObject.requestText + "',";
    query += "'" + queryObject.requestTitle + "',";
    query += "'" + queryObject.requestCategoryId + "',";
    query += "'" + queryObject.otherPerson + "',";
    query += "'" + queryObject.picture + "',";
    query += "'" + queryObject.prayerId + "',";
    query += active + ");";

    if (preview) {
	query += "SELECT request_id FROM request WHERE request_id = LAST_INSERT_ID();";
    }

    query += "SELECT user.real_name, user.email ";
    query += "FROM user ";
    query += "WHERE user.user_id <> '" + queryObject.userId + "';";

    query += "SELECT user.real_name ";
    query += "FROM user ";
    query += "WHERE user.user_id = '" + queryObject.userId + "';";

    const pool = createPool();
    module.exports = pool;
    pool.getConnection()
    	.then(conn => {
	    conn.query(query)
	    	.then((rows) => {
		    if (queryObject.prayerId != 37 && queryObject.sendEmail !== "on") {
			var obj = {};
			if (preview) {
			    obj["result"] = rows[1][0];
			} else {
			    obj["result"] = 'No email sent';
			}
			obj["query"] = query;
			console.log(JSON.stringify(obj));
			process.exit();
			return;
		    }

		    var obj = {};
		    var requestId = rows[0].insertId;
		    var url = "https://pireifej.com/prayer/request-feed.html?requestId=" + requestId;
		    var users = rows[2];
		    var realName = rows[3][0].real_name;
		    var comma = "";
		    var emailList = "";
		    var emails = [];

		    for (var i = 0; i < users.length; i++) {
			emailList += comma + users[i].email;
			emails.push(users[i].email);
			comma = ",";
		    }

		    if (env == "test" ||  queryObject.prayerId == 37) emails = "pireifej@gmail.com";

		    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'pireifej@gmail.com',
                            pass: 'bcvbfcsvklsnegqc'
                        }
                    });

		    fs.readFile(home + '/nodejs/emailTemplate.html', 'utf8', function (err,data) {
                        if (err) {
			    console.log(err);
                            return;
                        }

			var otherPerson = queryObject.otherPerson;

			data = data.replace("{{realName}}", realName);
			data = data.replace("{{realName}}", realName);
			
			if (otherPerson) {
			    data = data.replace("{{otherPerson}}", "(for " + otherPerson + ")");
			} else {
			    data = data.replace("{{otherPerson}}", "");
			}

			data = data.replace("{{prayerText}}", queryObject.requestText);
			data = data.replace("{{requestLink}}", url);

			var mySubject = (queryObject.prayerId == 37) ? "Assign Prayer For Me" : "Please pray for me!";

			var mailOptions = {
			    from: 'pireifej@gmail.com',
			    to: 'pireifej@gmail.com',
			    bcc: emails,
			    subject: mySubject,
			    html: data
			};
		    
			transporter.sendMail(mailOptions, function(error, info) {
			    if (error) {
				var obj = {};
				obj["result"] = 'Error: ' + error;
				obj["query"] = query;
				console.log(JSON.stringify(obj));
				process.exit();
				return;
			    } else {
				var obj = {};
				obj["output"] = env;
				obj["result"] = 'Email sent: ' + info.response;
				obj["query"] = query;
				console.log(JSON.stringify(obj));
				process.exit();
				conn.release();
				conn.end();
				return;
			    }
			});
		    })
		})
    		.catch(err => {
		    console.log("not connected due to error: " + err);
                    var obj = {};
                    obj["result"] = err;
                    obj["query"] = query;
                    console.log(JSON.stringify(obj));
                    conn.release();
                    conn.end();
                    process.exit();
		})
	})
    return;
}

if (command == "prayFor") {
    requireParam("requestId");
    requireParam("userId");
    
    var query = "INSERT INTO user_request (request_id, user_id) VALUES (";
    query += "'" + queryObject.requestId + "',";
    query += "'" + queryObject.userId + "'); ";

    query += "SELECT user.real_name, user.email, user.picture, request.request_title ";
    query += "FROM request ";
    query += "INNER JOIN user ON user.user_id = request.user_id ";
    query += "WHERE request.request_id = '" + queryObject.requestId + "'; ";

    query += "SELECT user.real_name, user.email, user.picture ";
    query += "FROM user ";
    query += "WHERE user.user_id = '" + queryObject.userId + "';";

    const pool = createPool();
    module.exports = pool;
    pool.getConnection()
    	.then(conn => {
	    conn.query(query)
	    	.then((rows) => {
		    var person1 = rows[1][0];
		    var person2 = rows[2][0];
		    
		    var transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
			    user: 'pireifej@gmail.com',
			    pass: 'bcvbfcsvklsnegqc'
			}
		    });

		    fs.readFile(home + '/nodejs/prayedEmailTemplate.html', 'utf8', function (err,data) {
			if (err) {
			    console.log(err);
			    return;
			}
			
			data = data.replace("{{realName}}", person2.real_name);
			data = data.replace("{{prayerText}}", person1.request_title);
			data = data.replace("{{picture}}", person2.picture);
			
			var mailOptions = {
			    from: 'pireifej@gmail.com',
			    to: person1.email,
			    bcc: 'pireifej@gmail.com',
			    subject: person2.real_name + " prayed for you!",
			    html: data
			};

			transporter.sendMail(mailOptions, function(error, info) {
			    if (error) {
				var obj = {};
				obj["result"] = 'Error: ' + error;
				obj["query"] = "No Query";
				console.log(JSON.stringify(obj));
				process.exit();
				return;
			    } else {
				var obj = {};
				obj["result"] = 'Email sent: ' + info.response;
				obj["query"] = "No Query";
				console.log(JSON.stringify(obj));
				process.exit();
				return;
			    }
			});
		    })
		})
    		.catch(err => {
		    console.log("not connected due to error: " + err);
                    var obj = {};
                    obj["result"] = err;
                    obj["query"] = query;
                    console.log(JSON.stringify(obj));
                    conn.release();
                    conn.end();
                    process.exit();
		})
	})
    return;
}

if (!query) {
    var returnError = { "status": "no query" };
    return;
}

const pool = createPool();
module.exports = pool;
pool.getConnection()
    .then(conn => {
	conn.query(query)
	    .then((rows) => {
		if (readFile) {
		    var textFileName = rows[0].prayer_file_name;
		    fs.readFile(home + '/prayers/' + textFileName, 'utf8', function (err,data) {
			if (err) {
			    //console.log(err);
			    return;
			}
			rows[0]["prayer_text"] = data;
			var obj = {};
			obj["result"] = rows;
			obj["query"] = query;
			console.log(JSON.stringify(obj));
			conn.release();
			conn.end();
			process.exit();
			return;
		    });
		} else {
		    var obj = {};
		    obj["result"] = rows;
		    obj["query"] = query;
		    console.log(JSON.stringify(obj));
		    conn.release();
		    conn.end();
		    process.exit();
		    return;
		}
	    })
	    .catch(err => {
		console.log("not connected due to error: " + err);
		var obj = {};
		obj["result"] = err;
		obj["query"] = query;
		console.log(JSON.stringify(obj));
		conn.release();
		conn.end();
		process.exit();
	    });
    });

return;

var obj = {};
obj["query"] = query;

    exports.getPosts = function(callback) {
	pool.getConnection()
	    .then(connection => {
		connection.query(query)
		    .then((rows) => {
			if (readFile) {
			    var textFileName = rows[0].prayer_file_name;
			    fs.readFile(home + '/prayers/' + textFileName, 'utf8', function (err,data) {
				if (err) {
				    //console.log(err);
				    return;
				}
				rows[0]["prayer_text"] = data;
				//console.log(queryObject.jsonpCallback + '('+ JSON.stringify(rows) + ');');
				console.log(JSON.stringify(rows));
				connection.end();
			    });
			} else {
			    //console.log(queryObject.jsonpCallback + '('+ JSON.stringify(rows) + ');');
			    console.log(JSON.stringify(rows));
			    connection.release();
			    connection.end();
			}
		    })})}
//}).listen(8080);
//console.log('Server running at https://198.12.248.83:8080/');
