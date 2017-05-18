/*------------------------------------------------------------------------------------
    MSF Dashboard - dev-defined.js
    (c) 2015-2017, MSF-Dashboard contributors for MSF
    List of contributors: https://github.com/MSF-UK/MSF-Dashboard/graphs/contributors
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/
/**
 * This module contains the parameters of the dashboard that have to be defined by the developer in order to tailor the tool to the specific needs of the future users. In the following we will look at the parameters needed to:
 * <ul>
 *   <li> get the medical and geometry data,</li>
 *   <li> check the medical and geometry data,</li> 
 *   <li> define the charts and maps, feed them with the correct data and define specific interaction,</li> 
 * </ul>
 * All these parameters are defined in <code>dev/dev-defined.js</code> and are stored in the global variable <code>g</code>. 
 * <br><br>
 * <code>g</code> stores other Objects as well that are not defined by the developer but that are the results of the processing and interactions. <code>g</code> can be accessed through your developer browser interface.  
 * <br><br>
 * As a reminder, two other files are crucial when setting up a new version of the Dashboard which are:
 * <ul>
 *   <li> the 'index.html' file which defines the divs and the positions of the charts and maps, and </li>
 *   <li> the {@link module:module-lang} ('lang/module-lang.js') which contains all the text that have to be displayed and its various translations.</li>
 * </ul>
 * @module g
 * @since v0.9.0
 * @requires lang/lang.js
 * @todo Limit list of parameters in g.
 * @todo Implement 'module_list' check to run or not the modules.
 */

/**
 * @module dev_defined
 */
g.dev_defined = {};

/*------------------------------------------------------------------------------------
    Components:
    1) Data parameters
    2) Data check parameters
    3) Charts parameters
------------------------------------------------------------------------------------*/

// 1) Data parameters
//------------------------------------------------------------------------------------

/**
 Defines the type of medical data parsed in the dashboard. <br>
 <br>
 Currently accepted values are:
 <ul>
     <li><code>surveillance</code> (aggregated) or</li>
     <li><code>outbreak</code> (linelist).</li>
 </ul>
 * @constant
 * @type {String} 
 * @alias module:g.medical_datatype
 */
g.medical_datatype = 'surveillance'; // 'outbreak' or 'surveillance'

/**
 Defines your incidence (and mortality) computation.
 * @constant
 * @type {Function} 
 * @alias module:dev_defined.definition_incidence
 */
g.dev_defined.definition_incidence = function(value,pop,periode) {
    /*if (pop==0) {
        return 0;       //HEIDI - should we return NaN here?
    } else {*/
        return value * 10000 / (pop * periode);             //Note: periode = number of epiweeks
    //}
};                                                      //Note: with changing population data (new pop format), then all values summed to value, all pops summed to pop and periode=1 - i.e. total cases/total pop

/**
 Defines your completeness computation.
 * @constant
 * @type {Boolean} 
 * @alias module:dev_defined.ignore_empty
 */
g.dev_defined.ignore_empty = true;
//g.dev_defined.ignore_errors = true;    //HEIDI - added this as a test - used in module-datacheck.js

/**
 * Contains the list of implemented map units.
 * <br> Defined in {@link module:module_colorscale}.
  Currently accepted values are:
 <ul>
     <li><code>Cases</code></li>
     <li><code>Deaths</code></li>
     <li><code>IncidenceProp</code></li>
     <li><code>MortalityProp</code></li>
     <li><code>Completeness</code></li>
 </ul>
 * @type {Array.<String>}
 * @constant
 * @alias module:module_colorscale.mapunitlist
 */
if(!g.module_colorscale){
    g.module_colorscale = {}; 
}
g.module_colorscale.mapunitlist = ['Cases', 'Deaths','IncidenceProp','MortalityProp','Completeness'];



//**************************************************************************************
g.new_layout = true;

//Combinations of map unit/geometry buttons that are not compatible 
// (i.e. one from g.module_colorscale.mapunitlist, one from g.geometry_keylist)
g.dev_defined.incompatible_buttons = [{unit: 'IncidenceProp',
                                       geo: 'hosp'},
                                      {unit: 'MortalityProp',
                                       geo: 'hosp'
                                      }]

//OPTIONAL FOR IF WE WANT SOMETHING DIFFERENT TO DEFAULT DEFINED IN module-chartwarper.js - i.e. names of containers for swapping between them
if(!g.module_chartwarper){
    g.module_chartwarper = {}; 
}

g.module_chartwarper.container_btns_id = 'container_ser_lin_btns'; 
g.module_chartwarper.container_allcharts_id = 'container_ser_lin';
g.module_chartwarper.container_chartlist = [{
                                        container: 'container_ser',
                                        height: '600px'
                                      },
                                      {
                                        container: 'container_lin',
                                        height: '400px'
                                      }];  

/**
 Lists the keys used to refer to specific {@link module:g.population_data} fields. It makes the link between headers in the data files and unambiguous keys used in the code.<br>
 Each element in the object is coded in the following way:
 <pre>*key_in_dashboard*: '*header_in_datafile*',</pre>
 <br>
 Currently implemented keys are:
 <ul>
    <li><code>admNx</code> for administrative or medical division name, format: <code>Adm1_name, Adm2_name...</code>,</li>
    <li><code>pop</code> for population.</li>
 * </ul>
 * @constant
 * @type {Object} 
 * @alias module:g.population_headerlist
 */

if(!g.module_population){
    g.module_population = {}; 
}
g.module_population.pop_new_format = true;    //HEIDI defined this where each year is given column heading of e.g. 'yr_2015', 'yr_2020', etc.
g.module_population.pop_headerlist = {
    admNx: 'name',
    //pop: 'population'
    //pop: 'yr_2015'
    pop: {'yr_2015': 2015,     //HEIDI added this - column headings with associated year
          'yr_2017': 2017}  
};

g.module_population.pop_perc_u5 = 18.9;   //HEIDI added this - percentage of population assumed to be under 5 -- put it in g.population_data?
g.module_population.pop_annual_growth = 3.0; //HEIDI added this - assumed percentage increase per year if pop data not supplied


//**************************************************************************************


/**
 * Defines the data parsed in the dashboard (urls and sources type). Order matters.<br>
 * <br>
 * Currently accepted methods are:
 * <ul>
 *    <li><code>arcgis_api</code> (not published yet)</li>
 *    <li><code>kobo_api</code> (not published yet)</li>
 *    <li><code>d3</code></li>
 *    <li><code>medicald3server</code></li>
 *    <li><code>medicald3noserver</code></li>
 *    <li><code>geometryd3</code></li>
 *    <li><code>populationd3</code></li>
 *    <li><code>medicalxlsx</code></li>
 * </ul>
 * @constant
 * @type {Object} 
 * @alias module:g.module_getdata
 */
g.module_getdata = {
    geometry: {         //these will contain data in the map
        admN1: {
            method:  'geometryd3',
            options: {  url: './data/geo_chief.geojson',
                        type: 'json'}
            },
        admN2: {
            method:  'geometryd3',
            options: {  url: './data/geo_phu_poly.geojson',
                        type: 'json'}
            },
        hosp: {
            method:  'geometryd3',
            options: {  url: './data/geo_hosp_poly.geojson',
                        type: 'json'}
            }
    },
    extralay:{      //these don't contain data - are used for other purposes e.g. masks, backgrounds, drawing
        mask:{
            method: 'd3',
            options: {  url: './data/geo_mask.geojson',
                        type: 'json'}
        },
        admN1:{
            method: 'd3',
            options: {  url: './data/geo_chief.geojson',
                        type: 'json'}
        },
    },
    medical:{
        medical: {
            method: 'medicald3noserver',
            options: {  url: 'input/tonkolili_database_wks-201545-201605.csv',
                        type: 'csv'}      
        }
    },
    population:{
        pop: {
            method: 'populationd3',
            options: {  url: './data/tonkolili_population.csv',
                        type: 'csv'}   
        }
    }
};


/**
 Lists the keys used to refer to specific {@link module:g.medical_data} fields. It makes the link between headers in the data files and unambiguous keys used in the code.<br>
 Each element in the object is coded in the following way:
 <pre>*key_in_dashboard*: '*header_in_datafile*',</pre>
 * @constant
 * @type {Object}
 * @alias module:g.medical_headerlist 
 **/

g.medical_headerlist = {
    epiwk: 'epiweek',     // Epidemiological week: format YYYY-WW
    admN1: 'chiefdom',    // Name of administrative/health division level N1 
    admN2: 'PHU',
    hosp: 'PHU',          //Note: shared attribute 'PHU' - have defined a list of hospitals to extract from PHU below (HEIDI should rename it); extraction defined in module_datacheck.dataprocessing 
    disease: 'disease',
    fyo: 'fyo',
    case: 'cas', 
    death: 'dth', 
    //test: 'PHU',
};
//HEIDI - define that admnN2+hosp=PHU - but all records have admN2 and only hospitals have hosp
//HEIDI - is it worth creating a look up that defines whether a PHU is an admN2 or a hosp - see valueAccessor in main-core where we define temp_adm = 'hosp';
//g.medical_hospitals_fullname = ["Kholifa Rowalla, Masanga Leprosy Hospital", "Gbonkolenken, Lion Heart Medical Centre", "Kholifa Rowalla, Magburaka Government Hospital"]; //HEIDI - same as g.geometry_loclists.hosp - do we need to redefine here at all?
g.medical_hospitals = ["Masanga Leprosy Hospital", "Lion Heart Medical Centre", "Magburaka Government Hospital"];  //for a separate layer to admN2
g.hosp = g.medical_hospitals;

function main_loadfiles_readvar(){
    /**
     Lists the keys from {@link module:g.medical_headerlist} that require custom parsing (eg. translate numbers into words).<br>
     Each element in the object is coded in the following way:
     <pre>*key_in_dashboard*: {*category1_in_medicaldata*: '*user-readable_output1*', *category2_in_medicaldata*: '*user-readable_output2*', ...},</pre>
     * @constant
     * @type {Object.<String, Object>} 
     * @alias module:g.medical_read
     * @todo Why is it in a function?
     */
    g.medical_read = {
        fyo:        {
                     u:g.module_lang.text[g.module_lang.current].chart_fyo_labelu,
                     o:g.module_lang.text[g.module_lang.current].chart_fyo_labelo,
                     a:g.module_lang.text[g.module_lang.current].chart_fyo_labela},         //HEIDI added this line
    };
}
//main_loadfiles_readvar();
/*g.medical_read = {
    fyo:        {
                 u:g.module_lang.text[g.module_lang.current].chart_fyo_labelu,
                 o:g.module_lang.text[g.module_lang.current].chart_fyo_labelo,
                 a:g.module_lang.text[g.module_lang.current].chart_fyo_labela   //HEIDI added this line
                 },         
    };*/





// 2) Data check parameters
//------------------------------------------------------------------------------------
/**
 Associates keys from {@link module:g.medical_headerlist} with datacheck tests performed in {@link module:module_datacheck~dataprocessing} and defined in {@link module:module_datacheck~testvalue}.<br>
 The elements are coded in the following way:
 <pre>*key*: {test_type: '*test_name*', setup:'*additional_elements*'},</pre>
 <br>
     Currently implemented test_types are:
     <ul>
        <li><code>none</code> which does not check anything,</li>
        <li><code>epiwk</code> which checks format is 'YYYY-WW',</li>
        <li><code>ingeometry</code> which checks whether the location name in the {@link g.medical_data} matches any location name in the {@link g.geometry_data} of the same divisional level,</li>
        <li><code>integer</code> which checks if the value is an integer,</li>
        <li><code>inlist</code> which checks if the value is in a list (parsed in <code>setup</code>),</li>
        <li><code>integer</code> which checks if the value is an integer.</li>
    </ul>
 * @constant
 * @type {Object.<String, Object>} 
 * @alias module:module_datacheck.definition_value
 * @todo Should maybe merged with merged with {@link module:g.medical_read}.
 */
if(!g.module_datacheck){
    g.module_datacheck = {}; 
}
g.module_datacheck.definition_value = {
    epiwk:  {test_type: 'epiwk',        setup: 'none'}, // Epidemiological week: format YYYY-WW
    admN1:  {test_type: 'ingeometry',   setup: 'none'}, // Name of division level N1 
    admN2:  {test_type: 'ingeometry',   setup: 'none'}, // Name of division level 
    hosp:  {test_type: 'ingeometry',   setup: 'none'},  // Name of division level   //HEIDI - do we need this?
    fyo:{test_type: 'inlist',       setup: ["u","o"]},  // Depends on data source
    case: {test_type: 'integer',      setup: 'none'}, 
    death:{test_type: 'integer',      setup: 'none'}, 
};

/**
 * Defines an array of Disease to be used as an <code>inlist</code> check in {@link module:module_datacheck~dataprocessing}. In case the list of disease to follow is not predefined, an empty array must be parsed and the list of diseases will be created in {@link module:module_datacheck~dataprocessing}.
 * @constant
 * @type {Array.<String>} 
 * @alias module:g.medical_diseaseslist
 */
 g.medical_diseaseslist = []; // Complete list of disease surveilled or left empty to build the list from data



// Define here the list of fields that are expected to constitute a unique identifier of a record
/**
 Defines the list of fields that are expected to constitute a unique identifier of a record to be used in the errors log in {@link module:module_datacheck}.
 The elements are coded in the following way:
 <pre>{key:  '*header_in_datafile*', isnumber: *boolean*},</pre>
 * @constant
 * @type {Array.<{key: String, isnumber: Boolean}>} 
 * @alias module:module_datacheck.definition_record
 */
g.module_datacheck.definition_record = [
    {key: g.medical_headerlist.epiwk, isnumber: false}, // 'true' key as in data file
    {key: g.medical_headerlist.disease, isnumber: false}, // 'true' key as in data file
    {key: g.medical_headerlist.admN1, isnumber: false}, // 'true' key as in data file
    {key: g.medical_headerlist.admN2, isnumber: false}, // 'true' key as in data file
    //{key: g.medical_headerlist.hosp, isnumber: false}, // 'true' key as in data file   //not needed for unique record identification
    {key: g.medical_headerlist.fyo, isnumber: false}, // 'true' key as in data file
];

// 3) Chart parameters
//------------------------------------------------------------------------------------
/**
 Lists the charts and maps to be produced by {@link module:main-core} as well as defines their main characteristics.<br>
 Each element in the object contains the following sub-elements:
 
 * ```
 chart_id:  {
    
    // Defined by the developer:
    domain_type: {String},             // 'custom_ordinal' or 'custom_linear' or 'custom_log' or 'custom_date' or 'none', 
    chart_type: {String},              // 'bar' or 'multiadm' or 'row' or 'stackedbar' or 'pie' or 'series' or 'table',
    dimension_type: {String},          // 'auto' or 'custom' or 'shared', 
    dimension_setup: {Array},          // [chart_id or dimkey,'auto' ot 'custom'] (mandatory if 'shared'),
    group_type: {String},              // 'auto' or 'custom' or 'none',
    group_setup: {Array},              // [datakey,datakeyopt] ('datakey' mandatory if 'surveillance', 'datakeyopt' if 'stackedbar'),
    display_axis: {Object},            // {x:'labelx',y:'labely'} (for x/y-type charts),
    display_colors: {Array.<Integer>}, // Refers to colors in g.color_domain,            
    display_intro_position: {String},           // 'top' or 'bottom' or 'right' or 'left' or 'none',
    display_idcontainer: {String},     // To display buttons on a div different from: chart-'chart_id' 
    buttons_list: {Array.<String>},    // ['reset','help'] - any, all or none of the two for most of charts plus 'expand','lockcolor' and 'parameters' for 'multiadm' charts,
    sync_to: {Array.<String>},         // ['chart_id's] - sync filtering with other charts
    
    // Processed by the dashboard:
    chart: {Object},                   // {@link module:main_core~chartInstancer} & {@link module:main_core~chartBuilder}
    dimension: {Object},               // {@link module:main_core~dimensionBuilder}
    domain: {Array},                   // {@link module:main_core~domainBuilder}
    group: {Object},                   // {@link module:main_core~groupBuilder}

 }
  *```
 <br>
 Each element is detailed in the following.
 * <ul>
    <li><code>chart_id</code>, 'chart-'<code>chart_id</code> must match a <code>div id</code> in the *index.html* file (the dashboard layout).</li>
    <li><code>domain_type</code> Definitions in: {@link module:main_core~domainBuilder}.
    <br>If =/= <code>'none'</code>, a custom domain is built. The <code>chart_id</code> is used to select the domain building method.</li>
    <br>
    <li><code>chart_type</code> Definitions in: {@link module:main_core~chartInstancer} and  {@link module:main_core~chartBuilder} (neither of these are properly declared as a method...).</li>
    <br>
    <li><code>dimension_type</code> Can be: 'auto' or 'custom' or 'shared' - Definitions in {@link module:main_core~dimensionBuilder}.
    <ul> 
        <li>If == <code>'auto'</code> - the dimension is assumed not to be shared - that means that <code>'auto'</code> is the dimension building method and <code>chart_id</code> is used to select the field to filter in {@link module:g.medical_data}.</li>

        <li>If == <code>'custom'</code>  - the dimension is assumed not to be shared - that means that <code>'chart_id'</code> is the dimension building method and it is used as well to select the field to filter in {@link module:g.medical_data} (when not overridden by the dimension builder definition).</li>

        <li>If == <code>'shared'</code> - <code>dimension_setup</code> parameter is compulsory.
            <ul>
                <li><code>dimension_setup[0]</code> is the <code>chart_id</code> of the chart with which the dimension is shared or the common identifier for the dimension</li>
                <li><code>dimension_setup[1]</code> can be <code>'auto'</code> or <code>'custom'</code> (just like a non-'shared' dimension...)
                    <ul> 
                        <li>If == <code>'auto'</code> that means that <code>'auto'</code> is the dimension building method and <code>dimension_setup[0]</code> is used to select the field to filter in {@link module:g.medical_data}.</li>

                        <li>If == <code>'custom'</code> that means that <code>dimension_setup[0]</code> is the dimension building method and it is used as well to select the field to filter in {@link module:g.medical_data} (when not overridden by the dimension builder definition).</li>
                </li>
            </ul>
        </li>
    </ul>
    Classical dimensions are stored under <code>[chart_id].dimension</code> in the {@link module:g.viz_definition} object. Whereas shared dimensions are stored under <code>[dimension_setup[0]].dimension</code>.
    </li>
    <br>
    <li><code>group_type</code> Can be: 'auto' or 'custom' or 'shared' (or 'none' for the data table) - Definitions in {@link module:main_core~groupBuilder}.
    <br>
    <ul> 
        <li>If == <code>'auto'</code>, that means that <code>'auto'</code> is the group building method.</li>

        <li>If == <code>'custom'</code>, that means that <code>'chart_type'</code> is the group building method.</li>
    </ul>
    Groups building instruction are specific to each {@link module:g.medical_datatype}.
    If {@link module:g.medical_datatype} == <code>'surveillance'</code> - <code>group_setup</code> parameter is compulsory. It is an Array where:
    <ul>
        <li><code>group_setup[0]</code> is used to select the field to count or sum in {@link module:g.medical_data}. NB: In a <code>'outbreak'</code> setting, records are counted from the patient list without a reference to a field.</li>
        <li><code>group_setup[1]</code> is used to select the field to create categories for stacked charts (<code>chart_type == stackedbar</code>. NB: Stacked chart have not been used yet in a <code>'outbreak'</code> setting.</li>
    </ul>
    </li>    
 * </ul>
 * @constant
 * @type {Object.<Object>}
 * @alias module:g.viz_definition 
 **/
g.viz_definition = {
   multiadm:  { domain_builder: 'none',            
                domain_parameter: 'none',

                instance_builder: 'multiadm',

                dimension_builder: 'multiadm',
                dimension_parameter: {  column: 'none',
                                        shared: false,
                                        namespace: 'none'},

                group_builder: 'multiadm',
                group_parameter: {  column: ['case','death']},

                display_colors: [0,1,2,3,4,5],  
                display_intro_position: 'bottom',
                display_filter: true,

                buttons_list: ['reset','help','expand','lockcolor','parameters'], 
                }, 

    disease:  { domain_builder: 'none', 
                domain_parameter: 'none',

                instance_builder: 'row',

                dimension_builder: 'normalize',
                dimension_parameter: {  column: 'disease',
                                        shared: false,
                                        namespace: 'none'},

                group_builder: 'count',
                group_parameter: {  column: 'none'},

                display_axis:   {x:g.module_lang.text[g.module_lang.current].chart_disease_labelx,
                                 y:g.module_lang.text[g.module_lang.current].chart_disease_labely},
                display_colors: [2],            
                display_intro_position: 'left',
                display_filter: true,
                buttons_list: ['help'],
                
            },
  
    case_ser: { domain_builder: 'date_extent',              
                domain_parameter: 'heidi_custom_time',        //HEIDI - can change name, doesn't have to match casedeath_ser_range domain_parameter name

                instance_builder: 'composite',

                dimension_builder: 'epidate',
                dimension_parameter: {  column: 'epiwk',
                                        shared: true,
                                        //shared: false,
                                        namespace: 'epirange'},
                                        //namespace: 'none'},

                group_builder: 'series_age',
                group_parameter: { column: ['case','fyo']},    

                //sync_to: ['casedeath_ser_range'],  
                //sync_to: ['death_ser'], 

                display_axis:   {x:'',
                                 y: g.module_lang.text[g.module_lang.current].chart_case_labely,
                                 y_imr: g.module_lang.text[g.module_lang.current].chart_ir_labely,
                                 y_comp: g.module_lang.text[g.module_lang.current].chart_comp_labely},    

                //display_colors: [4,2,1],     
                //display_colors: [999, 0,1],           //HEIDI - temporary fix   
                color_group: 'age_classes',    
                display_colors: [0,1,2],   
                display_intro_position: 'top',           
                display_intro_container: 'container_casedeath_ser',  
                //display_intro_container: 'container_ser_lin',
                display_filter: false,
                buttons_list: ['help'],               
            },

    death_ser: {domain_builder: 'date_extent',                 
                domain_parameter: 'heidi_custom_time',         

                instance_builder: 'composite',

                dimension_builder: 'epidate',
                dimension_parameter: {  column: 'epiwk',
                                        shared: true,       
                                        //shared: false,
                                        namespace: 'epirange'},
                                        //namespace: 'none'},

                group_builder: 'series_age',
                group_parameter: {  column: ['death','fyo']},    

                //sync_to: ['casedeath_ser_range'],  
                //sync_to: ['case_ser'],  


                display_axis:   {x:g.module_lang.text[g.module_lang.current].chart_death_labelx,
                                 y:g.module_lang.text[g.module_lang.current].chart_death_labely,
                                 y_imr: g.module_lang.text[g.module_lang.current].chart_mr_labely,
                                 y_comp: g.module_lang.text[g.module_lang.current].chart_comp_labely}, 
                //display_colors: [4,2,1],      
                //display_colors: [999, 0,1],           //HEIDI - temporary fix  
                color_group: 'age_classes', 
                display_colors: [0,1,2],   
                display_intro_position: 'none',           
                //display_idcontainer: 'container_casedeath_ser',   //IS THIS EVEN USED ANYWHERE???
                display_filter: false,
                buttons_list: ['help'],               
            },   

    casedeath_ser_range: { domain_builder: 'date_extent',          
                domain_parameter: 'heidi_custom_time',      

                instance_builder: 'bar',

                dimension_builder: 'epidate',
                dimension_parameter: {  column: 'epiwk',        
                                        shared: true,
                                        //shared: false,              //TRY VARYING THIS???
                                        namespace: 'epirange'},
                                        //namespace: 'none'},

                //group_builder: 'auto',
                //group_parameter: {  column: ['case']},    
                group_builder: 'auto',                    
                group_parameter: {  column: ['case','fyo']},    //HEIDI - should be    group_parameter: {  column: ['case']}, 

                sync_to: ['case_ser', 'death_ser'],   
                //sync_to: ['case_ser'], 
                //sync_to: ['death_ser'],  
                range_chart: true,                              //HEIDI - added new parameter
                //HEIDI - should we also define range_focus_charts here? is it different to sync_to???
                //HEIDI - quick filter currently has 3 button types: lastXepiweeks, lastXepimonths, lastXepiyears; could extend this though; 0 represents 'current' for epimonth and epiyear 
                buttons_filt_range: [{btn_type: 'lastXepiweeks', btn_param: 1, btn_text: 'Last full epiweek'},  //note all buttons are 'relative' time
                                    {btn_type: 'lastXepiweeks', btn_param: 4, btn_text: 'Last 4 epiweeks'},
                                    {btn_type: 'lastXepiweeks', btn_param: 52, btn_text: 'Last 52 epiweeks', btn_default: true},
                                    {btn_type: 'lastXepimonths', btn_param: 0, btn_text: 'Current epimonth'},     //0 for current (probably incomplete) epimonth
                                    {btn_type: 'lastXepimonths', btn_param: 1, btn_text: 'Last full epimonth'},  
                                    {btn_type: 'lastXepimonths', btn_param: 3, btn_text: 'Last 3 epimonths'}, 
                                    {btn_type: 'lastXepiyears', btn_param: 0, btn_text: 'Current epiyear'},
                                    {btn_type: 'lastXepiyears', btn_param: 1, btn_text: 'Last full epiyear'}],

                display_axis:   {x:'',
                                 y:'',
                                 y_imr: ''},        //HEIDI - need to put this in module-lang.js
                //display_colors: [4,2,1],     
                //display_colors: [999, 0,1],           //HEIDI - temporary fix 
                display_colors: [1],         
                display_intro_position: 'right',           
                display_intro_container: 'container_rangechart',
                display_filter: true,
                buttons_list: ['help'],               
            },
    
    case_lin: {domain_builder: 'week',
                domain_parameter: 'custom_linear',

                instance_builder: 'composite',

                dimension_builder: 'week_num',
                dimension_parameter: {  column: 'epiwk',
                                        shared: true,
                                        namespace: 'week'},

                group_builder: 'series_yr',
                group_parameter: {  column: ['case','epiwk']},

                sync_to: ['death_lin'],

                display_axis:   {x:'',
                                 y: g.module_lang.text[g.module_lang.current].chart_case_labely,
                                 y_imr: g.module_lang.text[g.module_lang.current].chart_ir_labely,
                                 y_comp: g.module_lang.text[g.module_lang.current].chart_comp_labely},       
                //display_colors: [4,2,1],  
                color_group: 'age_classes',
                display_colors: [4,5],          
                display_intro_position: 'top',                  
                display_intro_container: 'container_casedeath_lin',
                buttons_list: ['help'],
            },

    death_lin: {domain_builder: 'week',
                domain_parameter: 'custom_linear',  

                instance_builder: 'composite',

                dimension_builder: 'week_num',
                dimension_parameter: {  column: 'epiwk',
                                        shared: true,
                                        namespace: 'week'},

                group_builder: 'series_yr',
                group_parameter: {  column: ['death', 'epiwk']},

                sync_to: ['case_lin'],

                display_axis:   {x:g.module_lang.text[g.module_lang.current].chart_death_labelx,
                                 y:g.module_lang.text[g.module_lang.current].chart_death_labely,
                                 y_imr: g.module_lang.text[g.module_lang.current].chart_mr_labely,
                                 y_comp: g.module_lang.text[g.module_lang.current].chart_comp_labely},        
                //display_colors: [4,2,1],            
                color_group: 'age_classes',
                display_colors: [4,5],
                display_intro_position: 'none',
                buttons_list: ['help'],
            },    

    fyo: {  domain_builder: 'none',
                domain_parameter: 'none',  

                instance_builder: 'pie',

                dimension_builder: 'readcat',
                dimension_parameter: {  column: 'fyo',
                                        shared: false,
                                        namespace: 'none'},
                group_builder: 'auto',
                group_parameter: {  column: ['case']},

                //display_colors: [2,4],    
                //display_colors: [999, 1,0],           //HEIDI - temporary fix
                color_group: 'age_classes',
                display_colors: [2,1],
                display_intro_position: 'left',

                buttons_list: ['reset','help'],
                display_filter: true
            },

    year: {     domain_builder: 'year',
                domain_parameter: 'none',

                instance_builder: 'pie',

                dimension_builder: 'year',
                dimension_parameter: {  column: 'epiwk',
                                        shared: false,
                                        namespace: 'none'},

                group_builder: 'auto',
                group_parameter: {  column: ['case']},

                color_group: 'age_classes',
                display_colors: [4,5],

                display_intro_position: 'left',           
                //display_idcontainer: 'chart-year',
                display_filter: true,
                buttons_list: ['reset','help'],
            },

    table:  {   domain_builder: 'none',
                domain_parameter: 'none',            
                
                instance_builder: 'table',

                dimension_builder: 'auto',
                dimension_parameter: {  column: 'epiwk',
                                        shared: false,
                                        namespace: 'none'},

                group_builder: 'none',
                group_parameter: {  column: 'none'},

                display_intro_position: 'top',
                display_intro_container: 'container_table',
                buttons_list: ['help'],
            }, 
};

/**
 Defines the chart used as a reference for time-related interactions.
 * @constant
 * @type {String} 
 * @alias module:g.viz_timeline
 */
g.viz_timeline = 'casedeath_ser_range'; 
g.dev_defined.autoplay_delay = 2000;    //currently only defined for rangeChart
g.dev_defined.autoplay_rewind = false;  //at end of timeline, continues to play from beginning automatically; currently only defined for rangeChart


/**
 Defines the charts that are using time dimensions and that should be synchronized with the reference defined with {@link module:g.viz_timeline}.
 * @constant
 * @type {Array.<String>} 
 * @alias module:g.viz_timeshare
 * @todo Automate
 */
g.viz_timeshare = ['case_ser', 'death_ser'];

/**
 Defines the chart used as a reference for location-related interactions (e.g. incidence rates).
 * @constant
 * @type {String} 
 * @alias module:g.viz_locations
 */
g.viz_locations = 'multiadm';


/**
 Defines the layer position for each map layer. Heidi - attach diagram. If multiple layers have the same parent then they are siblings.
 * @constant
 * @type {String} 
 * @alias module:g.viz_parent_layer
 */
//HEIDI - need to attach diagram to demonstrate tree structure for numbering - see https://www.google.co.uk/search?q=tree+structure+numbering&tbm=isch&imgil=6gMJx-3aO3M0bM%253A%253BZ5hcRIa_-vtGmM%253Bhttps%25253A%25252F%25252Fwww.smartsheet.com%25252Ffree-work-breakdown-structure-templates&source=iu&pf=m&fir=6gMJx-3aO3M0bM%253A%252CZ5hcRIa_-vtGmM%252C_&usg=__qTvP_O0d3nAqBnwjc-J8jMjcT_8%3D&biw=1920&bih=974&ved=0ahUKEwikub6a4djTAhXoD8AKHT2PAQ4QyjcIMg&ei=vnAMWaTiAeifgAa9noZw#imgrc=6gMJx-3aO3M0bM:
/*g.viz_layer_pos = [{name: 'admN1', pos: '0'},     // 0 = top layer
                   {name: 'admN2', pos: '0.1'}, 
                   {name: 'hosp', pos: '0.2'}]; */

g.viz_layer_pos = {admN1: '0',     // 0 = top layer
                   admN2: '0.1',   // 0.1 = child of 0, sibling to 0.2
                   hosp: '0.2'};   // 0.2 = child of 0, sibling to 0.1


if(!g.module_intro){
    g.module_intro = {}; 
}
//g.dev_defined.intro_order = [];
//Define order of all intro topics, can either be charts (defined by name given above) or divs (defined in index.html)
//For and div intros, need to also define intro_position
g.module_intro.intro_order = ['intro', 'menu', 'multiadm', 'disease', 'container_ser_lin', 'case_ser', 'case_lin', 'casedeath_ser_range', 'fyo', 'year', 'table'];
g.module_intro.intro_position = [{container: 'container_ser_lin',
                                 position: 'top'
                                }];
//Here define which buttons (defined by div id) to click on before an intro element is called (to ensure appropriate chart/div is 'open' or not 'hidden' at the time it is called)
//Buttons defined in module_chartwarper.js
g.module_intro.intro_beforechange = [{           
                                     element: 'container_casedeath_ser',  
                                     click: '#container_ser-btn'
                                    }, {
                                     element: 'container_rangechart',
                                     click: '#container_ser-btn'
                                    },{
                                     element: 'container_ser_lin',
                                     click: '#container_ser-btn'
                                    },{
                                     element: 'chart-fyo',
                                     click: '#container_ser-btn'
                                    },{
                                     element: 'container_casedeath_lin',
                                     click: '#container_lin-btn'
                                    }]