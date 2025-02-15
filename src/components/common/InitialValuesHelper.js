import moment from "moment";
function tableEditInitialValues(table) {
  return {
    id: table.id,
    name: table.name,
    occupancy: table.occupancy,
    status: table.status,
    description: table.description
  };
}

function bookingEditInitialValues(booking) {
  return {
    id: booking.id,
    contactid: booking.contactid,
    tableid: booking.tableid,
    numberofperson: booking.numberofperson,
  };
}
function contactEditInitialValues(contact) {
  return {
    id: contact.id,
    salutation: contact.salutation,
    firstname: contact.firstname,
    lastname: contact.lastname,
    email: contact.email,
    phone: contact.phone,
    street: contact.street,
    title: contact.title,
    state: contact.state ? contact.state :"Rajasthan",
    city:contact.city ? contact.city :"Jaipur",
    pincode: contact.pincode,
    type: contact.type,
    country: "India",
  };
}
function propertyEditInitialValues(property) {
  return {
    id: property.id,
    name: property.name,
    //code:property.code,
    street: property.street,
    state: property.state ? property.state :"Rajasthan",
    city:property.city ? property.city :"Jaipur",
    country: "India",
    pincode: property.pincode,
    // phone:property.phone,
    // email:property.email,
    // type:property.type,
    // area:property.area,
    contactid: property.contactid,
    // ownerid:property.ownerid,
    description: property.description,
    // status:property.status,
    // projectid:property.projectid,
    // vidurl:property.vidurl,
    //areameasure:property.areameasure,
    //showonweb:property.showonweb,
    //cost:property.cost,
    //  propertyfor:property.propertyfor,
    // legalstatus:property.legalstatus,
    superbuiltuparea: property.superbuiltuparea,
    floor: property.floor,
    transactiontype: property.transactiontype,
    propertybase: property.propertybase,
    googlelocation: property.googlelocation,
    possessionstatus: property.possessionstatus,
    propertytype: property.propertytype,
    vertical: property.vertical,
    areatofrom: property.areatofrom,
    furnishedstatus: property.furnishedstatus,
    typeofclient: property.typeofclient,
    verticaltype: property.verticaltype,
    subverticaltype: property.subverticaltype,
    arearangein : property.arearangein,
    area : property.area,
    areato : property.areato,
    leaseexpirationdate : property.leaseexpirationdate ? property.leaseexpirationdate : '',
    areadetails: Array.from({  length:  property?.areadetails &&  property.areadetails?.length > 0 ?  property.areadetails?.length : 1 }, (record, index) => ({
      id: property?.areadetails ? property.areadetails[index]?.id : undefined,
      area: property?.areadetails ? property.areadetails[index]?.area : '',
      floor:property?.areadetails ?  property.areadetails[index]?.floor : '',
      unit: property?.areadetails ? property.areadetails[index]?.unit  : '',
      value:property?.areadetails ?  property.areadetails[index]?.value : '',
      type:'area'
    })),
    heightdetails: Array.from({  length:  property?.heightdetails &&  property.heightdetails?.length > 0 ?  property.heightdetails?.length : 1 }, (record, index) => ({
      id: property?.heightdetails ? property.heightdetails[index]?.id : undefined,
      floor:property?.heightdetails ?  property.heightdetails[index]?.floor : '',
      unit: property?.heightdetails ? property.heightdetails[index]?.unit  : '',
      value:property?.heightdetails ?  property.heightdetails[index]?.value : '',
      type:'height'
    })),
    openareaunit:property.openareaunit,
    openareavalue:property.openareavalue,
    closeareaunit:property.closeareaunit,
    closeareavalue:property.closeareavalue,
    noofdocksvalue:property?.noofdocksvalue ? property?.noofdocksvalue : 0,
    noofwashroomsvalue:property?.noofwashroomsvalue ? property?.noofwashroomsvalue : 0,
    rentalunit:property.rentalunit,
    rentalvalue:property.rentalvalue,
    officestate : property.officestate,
    officecity : property.officecity ,
    officestreet : property.officestreet,
    Possessiondate : property.Possessiondate,
    officepincode : property.officepincode,
    // areadetails: Array.from({ length: 1 }, () => ({
    //   area: property.records[index].area,
    //   floor: property.records[index].floor,
    //   unit: property.records[index].unit,
    //   value: property.records[index].value,
    // })),
  };
}
function leadEditInitialValues(lead) {
  //.log("lead in edit initialize 1", lead);
  return {
    id: lead.id,
    salutation: lead.salutation,
    firstname: lead.firstname,
    lastname: lead.lastname,
    email: lead.email,
    phone: lead.phone,
    alternatephone: lead.alternatephone,
    officephone: lead.officephone,
    remarks: lead.remarks,
    ratesqft: lead.ratesqft,
    brokerage: lead.brokerage,
    thirdparty: lead.thirdparty,
    address: lead.address,
    date: lead.date,
    street: lead.street,
    title: lead.title,
    state: lead.state,
    city: lead.city,
    pincode: lead.pincode,
    country: "India",
    status: lead.status,
    leadsource: lead.leadsource,
    industry: lead.industry,
    propertyid: lead.propertyid,
    budget: lead.budget,
    location: lead.location,
    company: lead.company,
    ownerid: lead.ownerid,
    description: lead.description,
    transactiontype: lead.transactiontype,
    typeofclient: lead.typeofclient,
    vertical: lead.vertical,
    verticaltype: lead.verticaltype,
    subverticaltype: lead.subverticaltype,
    areafromandto: lead.areafromandto,
    numberofcarortruckparking: lead.numberofcarortruckparking,
    type: lead.type,
    otherlocations: lead.otherlocations,
    otherdetails: lead.otherdetails,
    budgetrangefromandto: lead.budgetrangefromandto,
    budgetrangein: lead.budgetrangein,
    areabrief: lead.areabrief,
    area: lead.area,
    carpetarea: lead.carpetarea,
    heightfromandto: lead.heightfromandto,
    floorfromandto: lead.floorfromandto,
    completiondate: lead.completiondate,
    comments: lead.comments,
    client: lead.client,
    actions: lead.actions,
    ilid: lead.ilid,
    acmanagername: lead.acmanagername,
    memberoffice: lead.memberoffice,
    acmanageremail: lead.acmanageremail,
    acmanagerphone: lead.acmanagerphone,
    frontage: lead.frontage,
    zone: lead.zone,
  };
}
function leadInitialValues(lead) {
  //.log("lead in initialize 2", lead);
  return {
    acmanagerdetails:'',
    id: lead.id,
    leadstage: lead.leadstage ? lead.leadstage : 'No Stage',
    transactiontype: lead.transactiontype,
    typeofclient: lead.typeofclient,
    vertical: lead.vertical,
    verticaltype: lead.verticaltype,
    subverticaltype: lead.subverticaltype,
    areavaluein: lead.areavaluein,
    areafrom: lead.areafrom,
    areato: lead.areato,
    numberofcarortruckparking: lead.numberofcarortruckparking,
    type: lead.type,
    otherlocations: lead.otherlocations,
    otherdetails: lead.otherdetails,
    budgetrangein: lead.budgetrangein,
    budgetrangefrom: lead.budgetrangefrom,
    budgetrangeto: lead.budgetrangeto,
    areaorlocationbrief: lead.areaorlocationbrief,
    carpetarea: lead.carpetarea,
    heightrangein: lead.heightrangein,
    heightfrom: lead.heightfrom,
    heightto: lead.heightto,
    floorfrom: lead.floorfrom,
    floorto: lead.floorto,
    completiondate: lead.completiondate,
    frontage: lead.frontage,
    leadsource: lead.leadsource,
    zone: lead.zone,
    state: lead.state,
    city: lead.city,
  };
}

function leadPersonalInitialValues(lead) {
    //.log('lead values',lead)
  return {
    id: lead.id,
    firstname: lead.firstname,
    lastname: lead.lastname,
    company: lead.company,
    salutation: lead.salutation,
    designation: lead.designation,
    email: lead.email,
    phone: lead.phone,
    alternatephone: lead.alternatephone,
    office: lead.office,
    clientstreet: lead.clientstreet,
    clientcity: lead.clientcity,
    clientstate: lead.clientstate,
    clientcountry: lead.clientcountry ? lead.clientcountry : "India",
    clientpincode: lead.clientpincode,
    clientcalloption: lead.clientcalloption ? lead.clientcalloption : false,
    clientcalloptionemail: lead.clientcalloptionemail,
    clientcalloptionname: lead.clientcalloptionname,
    clientcalloptionmobile: lead.clientcalloptionmobile,
    clientcalloptiondate: lead.clientcalloptiondate,
    clientcalloptionremark: lead.clientcalloptionremark,
    clientcalloptionratepersqfeet: lead.clientcalloptionratepersqfeet,
    clientcalloptionbrokerage: lead.clientcalloptionbrokerage,

    ownerid: lead.ownerid,
    zone: lead.zone,
     
    customername: lead.customername,
    thirdparty: lead.thirdparty,
    ownername: lead.ownername,
    owneremail: lead.owneremail,
  };
}
function leadAddressInitialValues(lead) {
  return {
    areadetails: Array.from({  length:  lead?.areadetails   &&  lead.areadetails?.length > 0 ?  lead.areadetails?.length : 1 }, (record, index) => ({
      id: lead?.areadetails ? lead.areadetails[index]?.id : undefined,
      area: lead?.areadetails ? lead.areadetails[index]?.area : '',
      floor:lead?.areadetails ?  lead.areadetails[index]?.floor : '',
      unit: lead?.areadetails ? lead.areadetails[index]?.unit  : '',
      value:lead?.areadetails ?  lead.areadetails[index]?.value : '',
      type:'area'
    })),
    heightdetails: Array.from({  length:  lead?.heightdetails &&  lead.heightdetails?.length > 0 ?  lead.heightdetails?.length : 1 }, (record, index) => ({
      id: lead?.heightdetails ? lead.heightdetails[index]?.id : undefined,
      floor:lead?.heightdetails ?  lead.heightdetails[index]?.floor : '',
      unit: lead?.heightdetails ? lead.heightdetails[index]?.unit  : '',
      value:lead?.heightdetails ?  lead.heightdetails[index]?.value : '',
      type:'height'
    })),
    id: lead.id,
    frontagein: lead.frontagein,
    firstname: lead.firstname,
    lastname: lead.lastname,
    company: lead.company,
    salutation: lead.salutation,
    designation: lead.designation,
    email: lead.email,
    phone: lead.phone,
    alternatephone: lead.alternatephone,
    office: lead.office,
    clientstreet: lead.clientstreet,
    clientcity: lead.clientcity,
    clientstate: lead.clientstate ? lead.clientstate : "Rajasthan",
    clientcountry: lead.clientcountry ? lead.clientcountry : "India",
    clientpincode: lead.clientpincode,
    clientcalloption: lead.clientcalloption ? lead.clientcalloption : false,
    clientcalloptionemail: lead.clientcalloptionemail,
    clientcalloptionname: lead.clientcalloptionname,
    clientcalloptionmobile: lead.clientcalloptionmobile,
    clientcalloptiondate: lead.clientcalloptiondate,
    clientcalloptionremark: lead.clientcalloptionremark,
    clientcalloptionratepersqfeet: lead.clientcalloptionratepersqfeet,
    clientcalloptionbrokerage: lead.clientcalloptionbrokerage,
    ownerid: lead.ownerid,
    customername: lead.customername,
    thirdparty: lead.thirdparty,
    ownername: lead.ownername,
    owneremail: lead.owneremail,
    currentleadcity: lead.currentleadcity,
    actions: lead.actions,
    ilid: lead.ilid,
    client: lead.client,
    currentleadstate: lead.currentleadstate,
    area: lead.area,
    acmanagername: lead.acmanagername,
    memberoffice: lead.memberoffice,
    acmanageremail: lead.acmanageremail,
    acmanagerphone: lead.acmanagerphone,
    ilcloseddate: lead.ilcloseddate,
    ilcreateddate: lead.ilcreateddate,
    comments: lead.comments,
    acmanagerdetails: lead.acmanagerdetails ? lead.acmanagerdetails : false ,
    leadstage: lead.leadstage ? lead.leadstage : 'Open',
    transactiontype: lead.transactiontype,
    typeofclient: lead.typeofclient,
    vertical: lead.vertical,
    verticaltype: lead.verticaltype,
    subverticaltype: lead.subverticaltype,
    areavaluein: lead.areavaluein,
    areafrom: lead.areafrom,
    areato: lead.areato,
    numberofcarortruckparking: lead.numberofcarortruckparking,
    type: lead.type,
    otherlocations: lead.otherlocations,
    otherdetails: lead.otherdetails,
    budgetrangein: lead.budgetrangein,
    budgetrangefrom: lead.budgetrangefrom,
    budgetrangeto: lead.budgetrangeto,
    areaorlocationbrief: lead.areaorlocationbrief,
    carpetarea: lead.carpetarea,
    heightrangein: lead.heightrangein,
    heightfrom: lead.heightfrom,
    heightto: lead.heightto,
    floorfrom: lead.floorfrom,
    floorto: lead.floorto,
    completiondate: lead.completiondate,
    frontage: lead.frontage,
    leadsource: lead.leadsource,
    zone: lead.zone,
    state: lead.state,
    city: lead.city,
    clienttype:lead.clienttype,
    openareaunit:lead.openareaunit,
    openareavalue:lead.openareavalue,
    closeareaunit:lead.closeareaunit,
    closeareavalue:lead.closeareavalue,
    noofdocksvalue:lead?.noofdocksvalue ? lead?.noofdocksvalue : 0,
    noofwashroomsvalue:lead?.noofwashroomsvalue ? lead?.noofwashroomsvalue : 0,
    rentalunit:lead.rentalunit,
    rentalvalue:lead.rentalvalue,

  };
}

function projectEditInitialValues(project) {
  return {
    id: project.id,
    name: project.name,
    budget: project.budget,
    startdate: moment(project.startdate).format("YYYY-MM-DD"),
    enddate: moment(project.enddate).format("YYYY-MM-DD"),
    vidurl: project.vidurl,
    isactive: project.isactive,
    contactid: project.contactid,
    city: project.city,
    state: project.state,
    street: project.street,
    pincode: project.pincode,
    country: "India",
  };
}

function siteVisitInitialValues(siteVisit) {
  return {
    areadetails: Array.from({  length:  siteVisit?.areadetails   &&  siteVisit.areadetails?.length > 0 ?  siteVisit.areadetails?.length : 1 }, (record, index) => ({
      id: siteVisit?.areadetails ? siteVisit.areadetails[index]?.id : undefined,
      area: siteVisit?.areadetails ? siteVisit.areadetails[index]?.area : '',
      floor:siteVisit?.areadetails ?  siteVisit.areadetails[index]?.floor : '',
      unit: siteVisit?.areadetails ? siteVisit.areadetails[index]?.unit  : '',
      value:siteVisit?.areadetails ?  siteVisit.areadetails[index]?.value : '',
      type:'area'
    })),
    heightdetails: Array.from({  length:  siteVisit?.heightdetails &&  siteVisit.heightdetails?.length > 0 ?  siteVisit.heightdetails?.length : 1 }, (record, index) => ({
      id: siteVisit?.heightdetails ? siteVisit.heightdetails[index]?.id : undefined,
      floor:siteVisit?.heightdetails ?  siteVisit.heightdetails[index]?.floor : '',
      unit: siteVisit?.heightdetails ? siteVisit.heightdetails[index]?.unit  : '',
      value:siteVisit?.heightdetails ?  siteVisit.heightdetails[index]?.value : '',
      type:'height'
    })),
    id: siteVisit.id,
    fieldpersonid: siteVisit.fieldpersonid,
    siteid: siteVisit.siteid,
    sitename: siteVisit.sitename,
    status: siteVisit.status ? siteVisit.status : "Not Visited",
    // budget : project.budget,
    // startdate : moment(project.startdate).format("YYYY-MM-DD"),
    // enddate : moment(project.enddate).format("YYYY-MM-DD"),
    // vidurl : project.vidurl,
    // isactive : project.isactive,
    // contactid : project.contactid,
    // city : project.city,
    // state : project.state,
    // street : project.street,
    // pincode : project.pincode,

    description: siteVisit.description,

    ownername: siteVisit.ownername,
    owneractnumber: siteVisit.owneractnumber,
    secondcontactpersonname: siteVisit.secondcontactpersonname,
    secondcontactpersonphone: siteVisit.secondcontactpersonphone,
    email: siteVisit.email,
    propertyapprovalstatus: siteVisit.propertyapprovalstatus,
    propertytype: siteVisit.propertytype,
    floormapavailable: siteVisit.floormapavailable,
    firenocavailble: siteVisit.firenocavailble,
    nooffloor: siteVisit.nooffloor,
    propertyarea: siteVisit.propertyarea,
    eachfloorheight: siteVisit.eachfloorheight,
    frontage: siteVisit.frontage,
    noofentries: siteVisit.noofentries,
    liftavailable: siteVisit.liftavailable,
    parkingspace: siteVisit.parkingspace,
    previousbrand: siteVisit.previousbrand,
    location: siteVisit.location,
    locationarea: siteVisit.locationarea,
    expectedrent: siteVisit.expectedrent,
  };
}
function DailyTaskEditInitialValues(dailyTask) {
  return {
    id: dailyTask.id,
    title: dailyTask.title,
    priority: dailyTask.priority,
    status: dailyTask.status,
    targetdate: dailyTask.targetdate,
    ownerid: dailyTask.ownerid,
    description: dailyTask.description,
  };
}
export {
  tableEditInitialValues,
  contactEditInitialValues,
  propertyEditInitialValues,
  leadEditInitialValues,
  projectEditInitialValues,
  leadPersonalInitialValues,
  leadInitialValues,
  leadAddressInitialValues,
  siteVisitInitialValues,
  DailyTaskEditInitialValues,
  bookingEditInitialValues
};
