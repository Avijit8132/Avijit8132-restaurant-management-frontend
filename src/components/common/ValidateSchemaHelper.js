import * as yup from "yup";
import { EMAIL_REGEX, MOBILE_REGEX, NAME_REGEX, NUM_REGEX} from "./Regex";
import { MSG } from "./Messages";

function schemaContactEdit() {
    return yup.object().shape({
    //salutation: yup.string(),
    firstname: yup
      .string()
      .matches(NAME_REGEX, MSG.VALIDNAMREQ)
      .required(MSG.FNAMEREQ),
    lastname: yup
      .string()
      .matches(NAME_REGEX, MSG.VALIDNAMREQ)
      .required(MSG.LNAMEREQ),
    email: yup.string().nullable().matches(EMAIL_REGEX, MSG.INVEMAILREQ),
    phone: yup
      .string()
      .matches(MOBILE_REGEX, MSG.INVMOBNUMREQ)
      .required(MSG.MOBNUMREQ),
    ///street: yup.string(),
    //state: yup.string(),
    // city: yup.string(),
    // title: yup.string(),
    // type : yup.string(),
    pincode: yup
      .string().nullable()
      .matches(/^\d{6}$/, MSG.VLDPINCODE_REQ)
    });
}
function schemaTableEdit() {
  return yup.object().shape({
  //salutation: yup.string(),
  name: yup
    .string()
    .required(MSG.NAMEREQ),
    occupancy: yup
    .string()
    .matches(NUM_REGEX, MSG.VALIDNOREQ)
    .required(MSG.occupancyREQ),
    status: yup.string().nullable().matches(NAME_REGEX, MSG.TYPEREQ),
  });
}
function schemaPropertyEdit() {
    return yup.object().shape({
    name: yup.string().required(MSG.NAMEREQ),
   // areatofrom: yup.string().nullable().matches(NUM_REGEX,'Area to from must be grater or equal to 0'),
    //state: yup.string().nullable,
    //city: yup.string().nullable(),
   

    transactiontype : yup.string().required(MSG.TRNTYPEREQ),
    leaseexpirationdate: yup.date().test('conditionalRequired', null, function (value) {
      const transactiontype = this.parent.transactiontype;
      if (transactiontype === 'Lease') {
        return value ? true : this.createError({ message: MSG.LEASEEXPIERYDATE });
      }
      return true;
    }),
    typeofclient : yup.string().required(MSG.TYPOFCLIENTREQ),
    verticaltype : yup.string().required(MSG.VERTYPEREQ),
    vertical : yup.string().required(MSG.VERREQ),
    subverticaltype : yup.string().required(MSG.SUBVERTYPEREQ),
    pincode: yup.string().nullable().matches(/^\d{6}$/, MSG.VLDPINCODE_REQ) ,
    //----------------

    areadetails: yup.array().of(
      yup.object().shape({
        area: yup.string().nullable()
        .test('at-least-one-field-required', MSG.ATLEASTONEREQUIRED, function(ele) {
          const { unit, value, floor } = this.parent;
    
          if (ele && ((unit ==='' || unit ===undefined) || (value === '' ||value  ===undefined) ||(floor === undefined  || floor ===''))) {
            return  this.createError({ message: MSG.SELALLVALUES });
          }
    
          return true;
        }),
        unit: yup.string().nullable()
        .test('at-least-one-field-required', MSG.ATLEASTONEREQUIRED, function(ele) {
          const { area, value, floor } = this.parent;
    
          if (ele && ((area ==='' || area ===undefined) || (value === '' ||value  ===undefined) ||(floor === undefined  || floor ===''))) {
            return  this.createError({ message: MSG.SELALLVALUES });
          }
    
          return true;
        }),
        value: yup.string().nullable()
        .test('at-least-one-field-required', MSG.ATLEASTONEREQUIRED, function(ele) {
          const { area, unit, floor } = this.parent;
    
          if (ele && ((area ==='' || area ===undefined) || (unit === '' ||unit  ===undefined) ||(floor === undefined  || floor ===''))) {
            return  this.createError({ message: MSG.SELALLVALUES });
          }
    
          return true;
        }),
        floor: yup.string().nullable()
        .test('at-least-one-field-required', MSG.ATLEASTONEREQUIRED, function(ele) {
          const { area, unit, value } = this.parent;
    
          if (ele && ((area ==='' || area ===undefined) || (unit === '' ||unit  ===undefined) ||(value === undefined  || value ===''))) {
            return  this.createError({ message: MSG.SELALLVALUES });
          }
    
          return true;
        }),
      
      })),
      heightdetails: yup.array().of(
      yup.object().shape({
        unit: yup.string().nullable()
        .test('at-least-one-field-required', MSG.ATLEASTONEREQUIRED, function(ele) {
          const {  value, floor } = this.parent;
    
          if (ele && ( (value === '' ||value  ===undefined) ||(floor === undefined  || floor ===''))) {
            return  this.createError({ message: MSG.SELALLVALUES });
          }
    
          return true;
        }),
        value: yup.string().nullable()
        .test('at-least-one-field-required', MSG.ATLEASTONEREQUIRED, function(ele) {
          const { unit, floor } = this.parent;
    
          if (ele && ( (unit === '' ||unit  ===undefined) ||(floor === undefined  || floor ===''))) {
            return  this.createError({ message: MSG.SELALLVALUES });
          }
    
          return true;
        }),
        floor: yup.string().nullable()
        .test('at-least-one-field-required', MSG.ATLEASTONEREQUIRED, function(ele) {
          const {  unit, value } = this.parent;
    
          if (ele && ( (unit === '' ||unit  ===undefined) ||(value === undefined  || value ===''))) {
            return  this.createError({ message: MSG.SELALLVALUES });
          }
    
          return true;
        }),
      
      }))
   
    //----------------

    
  });
}
function schemaLeadEdit() {
  return yup.object().shape({
  //salutation: yup.string(),
  firstname: yup
    .string()
    .matches(NAME_REGEX, MSG.VALIDNAMREQ)
    .required(MSG.FNAMEREQ),
  lastname: yup
    .string()
    .matches(NAME_REGEX, MSG.VALIDNAMREQ)
    .required(MSG.LNAMEREQ),
  phone: yup
    .string()
    .matches(MOBILE_REGEX, MSG.INVMOBNUMREQ)
    .required(MSG.MOBNUMREQ),
  pincode: yup
    .string().nullable()
    .matches(/^\d{6}$/, MSG.VLDPINCODE_REQ),
  status: yup
    .string()
    .required(MSG.STATUSREQ),
  ownerid: yup
    .string()
    .required(MSG.OWNERREQ),

  });

}
function schemaLeadPersonalInfo() {
  return yup.object().shape({
  firstname: yup.string().matches(NAME_REGEX, MSG.VALIDNAMREQ).required(MSG.FNAMEREQ),
  lastname: yup.string().matches(NAME_REGEX, MSG.VALIDNAMREQ).required(MSG.LNAMEREQ),
  clientcalloption: yup.boolean(),
 
  clientcalloptionname: yup.string().matches(NAME_REGEX,MSG.VALIDNAMREQ).test('conditionalRequired', null, function (value) {
    const clientcalloption = this.parent.clientcalloption;
    if (clientcalloption) {
      return value ? true : this.createError({ message: MSG.NAMEREQ });
    }
    return true;
  }),
    phone: yup.string().nullable().matches(MOBILE_REGEX, MSG.INVMOBNUMREQ),
    clientcalloptionratepersqfeet: yup.string().nullable().matches(NUM_REGEX,MSG.NEGETIVE),
    email: yup.string().nullable().matches(EMAIL_REGEX, MSG.INVEMAILREQ),
    clientcalloptionemail: yup.string().nullable().matches(EMAIL_REGEX, MSG.INVEMAILREQ),
    clientpincode: yup.string().nullable().matches(/^\d{6}$/, MSG.VLDPINCODE_REQ),
      alternatephone:yup.string().nullable().matches(MOBILE_REGEX, MSG.INVMOBNUMREQ),
      ownerid: yup.string().required(MSG.OWNERREQ),
    });
  }
  function schemaLeadInfo() {
    return yup.object().shape({
      leadstage: yup.string(),
      acmanagerdetails: yup.boolean(),
      client: yup.string().matches(NAME_REGEX,MSG.VALIDNAMREQ).test('conditionalRequired', null, function (value) {
        const acmanagerdetails = this.parent.acmanagerdetails;
        if (acmanagerdetails) {
          return value ? true : this.createError({ message: MSG.NAMEREQ });
        }
        return true;
      }),
      areato: yup.string().nullable().matches(NUM_REGEX,MSG.NEGETIVE)
      .test('at-least-one-field-required', MSG.ATLEASTONEREQUIRED, function(value) {
        const { areato, areafrom, areavaluein } = this.parent;
          //.log('data',areafrom,areato,areavaluein,value);
        if (value && ((areato ==='' || areato ===undefined) || (areafrom === '' ||areafrom  ===undefined) ||(areavaluein === undefined  || areavaluein ===''))) {
         
          return this.createError({ message: MSG.SELALLVALUES });
        }
  
        return true;
      }),
      areafrom: yup.string().nullable().matches(NUM_REGEX,MSG.NEGETIVE)
      .test('at-least-one-field-required', MSG.ATLEASTONEREQUIRED, function(value) {
        const { areato, areafrom, areavaluein } = this.parent;
  
        if (value && ((areato ==='' || areato ===undefined) || (areafrom === '' ||areafrom  ===undefined) ||(areavaluein === undefined  || areavaluein ===''))) {
          return  this.createError({ message: MSG.SELALLVALUES });
        }
  
        return true;
      }),
      areavaluein: yup.string().nullable()
      .test('at-least-one-field-required', MSG.ATLEASTONEREQUIRED, function(value) {
        const { areato, areafrom, areavaluein } = this.parent;
  
        if (value && ((areato ==='' || areato ===undefined) || (areafrom === '' ||areafrom  ===undefined) ||(areavaluein === undefined  || areavaluein ===''))) {
          return  this.createError({ message: MSG.SELALLVALUES });
        }
  
        return true;
      }),

      heightrangein: yup.string().nullable()
      .test('at-least-one-field-required', MSG.ATLEASTONEREQUIRED, function(value) {
        const { heightto, heightfrom, heightrangein } = this.parent;
          //.log('data',heightfrom,heightto,heightrangein,value);
        if (value && ((heightto ==='' || heightto ===undefined) || (heightfrom === '' ||heightfrom  ===undefined) ||(heightrangein === undefined  || heightrangein ===''))) {
         
          return this.createError({ message: MSG.SELALLVALUES });
        }
  
        return true;
      }),
      records: yup.array().of(
        yup.object().shape({
      areatype: yup.string().required(MSG.AREATYPEREQ),
      unit: yup.string().required(MSG.UNITREQ),
      value: yup.string().required(MSG.VALUEREQ),
      floor: yup.string().required(MSG.FLOORREQ),
        
        })
    ),
    heightvalue: yup.array().of(
        yup.object().shape({
      unit: yup.string().required(MSG.UNITREQ),
      value: yup.string().required(MSG.VALUEREQ),
      floor: yup.string().required(MSG.FLOORREQ),
        
        })
    ),
    
      heightfrom: yup.string().nullable().matches(NUM_REGEX,MSG.NEGETIVE)
      .test('at-least-one-field-required', MSG.ATLEASTONEREQUIRED, function(value) {
        const { heightto, heightfrom, heightrangein } = this.parent;
          //.log('data',heightfrom,heightto,heightrangein,value);
        if (value && ((heightto ==='' || heightto ===undefined) || (heightfrom === '' ||heightfrom  ===undefined) ||(heightrangein === undefined  || heightrangein ===''))) {
         
          return this.createError({ message: MSG.SELALLVALUES });
        }
  
        return true;
      }),
      heightto: yup.string().nullable().matches(NUM_REGEX,MSG.NEGETIVE)
      .test('at-least-one-field-required', MSG.ATLEASTONEREQUIRED, function(value) {
        const { heightto, heightfrom, heightrangein } = this.parent;
        if (value && ((heightto ==='' || heightto ===undefined) || (heightfrom === '' ||heightfrom  ===undefined) ||(heightrangein === undefined  || heightrangein ===''))) {
         
          return this.createError({ message: MSG.SELALLVALUES });
        }
  
        return true;
      }),
     
      budgetrangein: yup.string().nullable()
      .test('at-least-one-field-required', MSG.ATLEASTONEREQUIRED, function(value) {
        const { budgetrangein, budgetrangefrom, budgetrangeto } = this.parent;
        if (value && ((budgetrangein ==='' || budgetrangein ===undefined) || (budgetrangefrom === '' ||budgetrangefrom  ===undefined) ||(budgetrangeto === undefined  || budgetrangeto ===''))) {
          return this.createError({ message: MSG.SELALLVALUES });
        }
        return true;
      }),
      budgetrangefrom: yup.string().nullable()
      .test('at-least-one-field-required', MSG.ATLEASTONEREQUIRED, function(value) {
        const { budgetrangein, budgetrangefrom, budgetrangeto } = this.parent;
        if (value && ((budgetrangein ==='' || budgetrangein ===undefined) || (budgetrangefrom === '' ||budgetrangefrom  ===undefined) ||(budgetrangeto === undefined  || budgetrangeto ===''))) {
          return this.createError({ message: MSG.SELALLVALUES });
        }
        return true;
      }),
      budgetrangeto: yup.string().nullable()
      .test('at-least-one-field-required', MSG.ATLEASTONEREQUIRED, function(value) {
        const { budgetrangein, budgetrangefrom, budgetrangeto } = this.parent;
        if (value && ((budgetrangein ==='' || budgetrangein ===undefined) || (budgetrangefrom === '' ||budgetrangefrom  ===undefined) ||(budgetrangeto === undefined  || budgetrangeto ===''))) {
          return this.createError({ message: MSG.SELALLVALUES });
        }
        return true;
      }),
      floorfrom: yup.string().nullable().matches(NUM_REGEX,MSG.NEGETIVE)
      .test('at-least-one-field-required', MSG.ATLEASTONEREQUIRED, function(value) {
        const { floorto} = this.parent;
        if (value && ((floorto ==='' || floorto ===undefined))) {
          return this.createError({ message: MSG.SELALLVALUES });
        }
        return true;
      }),
      floorto: yup.string().nullable().matches(NUM_REGEX,MSG.NEGETIVE)
      .test('at-least-one-field-required', MSG.ATLEASTONEREQUIRED, function(value) {
        const { floorfrom} = this.parent;
        if (value && ((floorfrom ==='' || floorfrom ===undefined))) {
          return this.createError({ message: MSG.SELALLVALUES });
        }
        return true;
      }),
      frontage: yup.string().nullable()
      .test('at-least-one-field-required', MSG.ATLEASTONEREQUIRED, function(value) {
        const { frontagein} = this.parent;
        if (value && ((frontagein ==='' || frontagein ===undefined))) {
          return this.createError({ message: MSG.SELALLVALUES });
        }
        return true;
      }),
      frontagein: yup.string().nullable().matches(NUM_REGEX,MSG.NEGETIVE)
      .test('at-least-one-field-required', MSG.ATLEASTONEREQUIRED, function(value) {
        const { frontage} = this.parent;
        if (value && ((frontage ==='' || frontage ===undefined))) {
          return this.createError({ message: MSG.SELALLVALUES });
        }
        return true;
      }),
  
      areadetails: yup.array().of(
        yup.object().shape({
          area: yup.string().nullable()
          .test('at-least-one-field-required', MSG.ATLEASTONEREQUIRED, function(ele) {
            const { unit, value, floor } = this.parent;
      
            if (ele && ((unit ==='' || unit ===undefined) || (value === '' ||value  ===undefined) ||(floor === undefined  || floor ===''))) {
              return  this.createError({ message: MSG.SELALLVALUES });
            }
      
            return true;
          }),
          unit: yup.string().nullable()
          .test('at-least-one-field-required', MSG.ATLEASTONEREQUIRED, function(ele) {
            const { area, value, floor } = this.parent;
      
            if (ele && ((area ==='' || area ===undefined) || (value === '' ||value  ===undefined) ||(floor === undefined  || floor ===''))) {
              return  this.createError({ message: MSG.SELALLVALUES });
            }
      
            return true;
          }),
          value: yup.string().nullable()
          .test('at-least-one-field-required', MSG.ATLEASTONEREQUIRED, function(ele) {
            const { area, unit, floor } = this.parent;
      
            if (ele && ((area ==='' || area ===undefined) || (unit === '' ||unit  ===undefined) ||(floor === undefined  || floor ===''))) {
              return  this.createError({ message: MSG.SELALLVALUES });
            }
      
            return true;
          }),
          floor: yup.string().nullable()
          .test('at-least-one-field-required', MSG.ATLEASTONEREQUIRED, function(ele) {
            const { area, unit, value } = this.parent;
      
            if (ele && ((area ==='' || area ===undefined) || (unit === '' ||unit  ===undefined) ||(value === undefined  || value ===''))) {
              return  this.createError({ message: MSG.SELALLVALUES });
            }
      
            return true;
          }),
        
        })),
        heightdetails: yup.array().of(
        yup.object().shape({
          unit: yup.string().nullable()
          .test('at-least-one-field-required', MSG.ATLEASTONEREQUIRED, function(ele) {
            const {  value, floor } = this.parent;
      
            if (ele && ( (value === '' ||value  ===undefined) ||(floor === undefined  || floor ===''))) {
              return  this.createError({ message: MSG.SELALLVALUES });
            }
      
            return true;
          }),
          value: yup.string().nullable()
          .test('at-least-one-field-required', MSG.ATLEASTONEREQUIRED, function(ele) {
            const { unit, floor } = this.parent;
      
            if (ele && ( (unit === '' ||unit  ===undefined) ||(floor === undefined  || floor ===''))) {
              return  this.createError({ message: MSG.SELALLVALUES });
            }
      
            return true;
          }),
          floor: yup.string().nullable()
          .test('at-least-one-field-required', MSG.ATLEASTONEREQUIRED, function(ele) {
            const {  unit, value } = this.parent;
      
            if (ele && ( (unit === '' ||unit  ===undefined) ||(value === undefined  || value ===''))) {
              return  this.createError({ message: MSG.SELALLVALUES });
            }
      
            return true;
          }),
        
        }))
     
      // floorto: yup.string().nullable().matches(NUM_REGEX,MSG.NEGETIVE),
      // floorfrom: yup.string().nullable().matches(NUM_REGEX,MSG.NEGETIVE),
      // acmanagername: yup.string().nullable().matches(NAME_REGEX, MSG.VALIDNAMREQ),
      // acmanageremail: yup.string().nullable().matches(EMAIL_REGEX, MSG.INVEMAILREQ),
      // acmanagerphone:yup.string().nullable().matches(MOBILE_REGEX, MSG.INVMOBNUMREQ),
  })
  
}
function schemaLeadAddress() {
  return yup.object().shape({
    firstname: yup.string().matches(NAME_REGEX, MSG.VALIDNAMREQ).required(MSG.FNAMEREQ),
    
  });
}
function schemaProjectEdit() {
  return yup.object().shape({
  //salutation: yup.string(),
  name: yup
    .string()
    .matches(NAME_REGEX, MSG.VALIDNAMREQ)
    .required(MSG.NAMEREQ),
  ///street: yup.string(),
  //state: yup.string(),
  // city: yup.string(),
  // title: yup.string(),
  // type : yup.string(),
  pincode: yup
    .string().nullable()
    .matches(/^\d{6}$/, MSG.VLDPINCODE_REQ)
  });
}
function schemaDailyTaskInfo() {
  return yup.object().shape({
  title: yup
    .string()
    .required(MSG.TITLEREQ),
    priority: yup
    .string()
    .required(MSG.PRIORITYREQ),
  ownerid: yup
    .string()
    .required(MSG.OWNERREQ),
  });
}

function schemaSiteVisitEdit() {
  return yup.object().shape({
  sitename: yup
  .string()
  .required(MSG.SITEREQ),
  
  fieldpersonid: yup
  .string()
  .required(MSG.FIELDPERSON),
  areadetails: yup.array().of(
    yup.object().shape({
      area: yup.string().nullable()
      .test('at-least-one-field-required', MSG.ATLEASTONEREQUIRED, function(ele) {
        const { unit, value, floor } = this.parent;
  
        if (ele && ((unit ==='' || unit ===undefined) || (value === '' ||value  ===undefined) ||(floor === undefined  || floor ===''))) {
          return  this.createError({ message: MSG.SELALLVALUES });
        }
  
        return true;
      }),
      unit: yup.string().nullable()
      .test('at-least-one-field-required', MSG.ATLEASTONEREQUIRED, function(ele) {
        const { area, value, floor } = this.parent;
  
        if (ele && ((area ==='' || area ===undefined) || (value === '' ||value  ===undefined) ||(floor === undefined  || floor ===''))) {
          return  this.createError({ message: MSG.SELALLVALUES });
        }
  
        return true;
      }),
      value: yup.string().nullable()
      .test('at-least-one-field-required', MSG.ATLEASTONEREQUIRED, function(ele) {
        const { area, unit, floor } = this.parent;
  
        if (ele && ((area ==='' || area ===undefined) || (unit === '' ||unit  ===undefined) ||(floor === undefined  || floor ===''))) {
          return  this.createError({ message: MSG.SELALLVALUES });
        }
  
        return true;
      }),
      floor: yup.string().nullable()
      .test('at-least-one-field-required', MSG.ATLEASTONEREQUIRED, function(ele) {
        const { area, unit, value } = this.parent;
  
        if (ele && ((area ==='' || area ===undefined) || (unit === '' ||unit  ===undefined) ||(value === undefined  || value ===''))) {
          return  this.createError({ message: MSG.SELALLVALUES });
        }
  
        return true;
      }),
    
    })),
    heightdetails: yup.array().of(
    yup.object().shape({
      unit: yup.string().nullable()
      .test('at-least-one-field-required', MSG.ATLEASTONEREQUIRED, function(ele) {
        const {  value, floor } = this.parent;
  
        if (ele && ( (value === '' ||value  ===undefined) ||(floor === undefined  || floor ===''))) {
          return  this.createError({ message: MSG.SELALLVALUES });
        }
  
        return true;
      }),
      value: yup.string().nullable()
      .test('at-least-one-field-required', MSG.ATLEASTONEREQUIRED, function(ele) {
        const { unit, floor } = this.parent;
  
        if (ele && ( (unit === '' ||unit  ===undefined) ||(floor === undefined  || floor ===''))) {
          return  this.createError({ message: MSG.SELALLVALUES });
        }
  
        return true;
      }),
      floor: yup.string().nullable()
      .test('at-least-one-field-required', MSG.ATLEASTONEREQUIRED, function(ele) {
        const {  unit, value } = this.parent;
  
        if (ele && ( (unit === '' ||unit  ===undefined) ||(value === undefined  || value ===''))) {
          return  this.createError({ message: MSG.SELALLVALUES });
        }
  
        return true;
      }),
    
    }))
  })
}

export {
    schemaContactEdit,
    schemaPropertyEdit,
    schemaLeadEdit,
    schemaProjectEdit,
    schemaLeadPersonalInfo,
    schemaLeadInfo,
    schemaLeadAddress,
    schemaSiteVisitEdit,
    schemaDailyTaskInfo,
    schemaTableEdit
}