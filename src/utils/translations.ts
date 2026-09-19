import { LanguageCode } from '../types';

export const TRANSLATIONS: Record<LanguageCode, {
  appTitle: string;
  appSubtitle: string;
  commandCenter: string;
  mobileFieldApp: string;
  online: string;
  offline: string;
  offlineNotice: string;
  kpis: {
    monitoredZones: string;
    highRiskZones: string;
    activeAlerts: string;
    blockedRoads: string;
    activeSensors: string;
    citizenReports: string;
  };
  tabs: {
    gisMap: string;
    emergencyMatrix: string;
    earlyWarnings: string;
    aiImageInspector: string;
    dataCollection: string;
    historicalData: string;
  };
  filters: {
    allStates: string;
    allRiskLevels: string;
    layerSensors: string;
    layerInfra: string;
    layerRoads: string;
    layerHeatmap: string;
  };
  riskLabels: {
    LOW: string;
    MODERATE: string;
    HIGH: string;
    CRITICAL: string;
  };
  mobile: {
    myLocationRisk: string;
    reportIncident: string;
    roadStatus: string;
    sosEmergency: string;
    offlineSaved: string;
    syncSuccess: string;
    verifyWorkflow: string;
  };
}> = {
  en: {
    appTitle: 'NER Landslide Early Warning System',
    appSubtitle: 'AI-Powered Hazard Monitoring & Disaster Response for North Eastern Region of India',
    commandCenter: 'Authority Command Center',
    mobileFieldApp: 'Citizen & Field Mobile View',
    online: 'LIVE TELEMETRY: CONNECTED',
    offline: 'LOW NETWORK: OFFLINE CACHE',
    offlineNotice: 'Operating in low-bandwidth offline mode. Reports will be safely cached and synced upon signal restoration.',
    kpis: {
      monitoredZones: 'Monitored Sectors',
      highRiskZones: 'Critical / High Risk',
      activeAlerts: 'Active Emergency Warnings',
      blockedRoads: 'Blocked Highway Corridors',
      activeSensors: 'Active IoT Nodes',
      citizenReports: 'Verified Field Reports',
    },
    tabs: {
      gisMap: 'GIS Risk Map',
      emergencyMatrix: 'Emergency Prioritisation',
      earlyWarnings: 'Early Warnings & Bulletins',
      aiImageInspector: 'AI Vision Crack Inspector',
      dataCollection: 'Sensors & Weather Data',
      historicalData: 'Historical Landslide Archive',
    },
    filters: {
      allStates: 'All 8 NER States',
      allRiskLevels: 'All Risk Categories',
      layerSensors: 'IoT Sensors',
      layerInfra: 'Critical Infrastructure',
      layerRoads: 'National Highways',
      layerHeatmap: 'Risk Zones Heatmap',
    },
    riskLabels: {
      LOW: 'Low Risk',
      MODERATE: 'Moderate Risk',
      HIGH: 'High Risk',
      CRITICAL: 'Critical Danger',
    },
    mobile: {
      myLocationRisk: 'Current GPS Slope Risk',
      reportIncident: 'Report Landslide / Crack',
      roadStatus: 'Highway Passability Check',
      sosEmergency: 'SOS EMERGENCY BEACON',
      offlineSaved: 'Report queued in offline memory',
      syncSuccess: 'All queued field reports synchronized to central cloud database',
      verifyWorkflow: 'Field Officer Verification Queue',
    },
  },
  hi: {
    appTitle: 'पूर्वोत्तर भारत भूस्खलन पूर्व चेतावनी प्रणाली',
    appSubtitle: 'पूर्वोत्तर क्षेत्र के लिए एआई-संचालित जोखिम निगरानी और आपदा प्रबंधन मंच',
    commandCenter: 'आपदा नियंत्रण कक्ष',
    mobileFieldApp: 'नागरिक एवं फील्ड मोबाइल ऐप',
    online: 'लाइव टेलीमेट्री: सक्रिय',
    offline: 'कम नेटवर्क: ऑफलाइन मोड',
    offlineNotice: 'कम नेटवर्क मोड सक्रिय है। सभी रिपोर्ट्स स्थानीय मेमोरी में सुरक्षित हैं और नेटवर्क आने पर अपने आप सिंक होंगी।',
    kpis: {
      monitoredZones: 'निगरानी क्षेत्र',
      highRiskZones: 'अति संवेदनशील / उच्च जोखिम',
      activeAlerts: 'सक्रिय आपातकालीन चेतावनियां',
      blockedRoads: 'अवरुद्ध राजमार्ग',
      activeSensors: 'सक्रिय आईओटी सेंसर',
      citizenReports: 'फील्ड एवं नागरिक रिपोर्ट्स',
    },
    tabs: {
      gisMap: 'जीआईएस जोखिम मानचित्र',
      emergencyMatrix: 'आपातकालीन प्राथमिकता सूची',
      earlyWarnings: 'पूर्व चेतावनी बुलेटिन',
      aiImageInspector: 'एआई दरार व भूस्खलन जांच',
      dataCollection: 'सेंसर एवं मौसम डेटा',
      historicalData: 'ऐतिहासिक भूस्खलन रिकॉर्ड',
    },
    filters: {
      allStates: 'सभी 8 पूर्वोत्तर राज्य',
      allRiskLevels: 'सभी जोखिम स्तर',
      layerSensors: 'आईओटी सेंसर',
      layerInfra: 'महत्वपूर्ण बुनियादी ढांचा',
      layerRoads: 'राष्ट्रीय राजमार्ग',
      layerHeatmap: 'जोखिम हीटमैप',
    },
    riskLabels: {
      LOW: 'सामान्य स्थिति',
      MODERATE: 'मध्यम जोखिम',
      HIGH: 'उच्च जोखिम',
      CRITICAL: 'गंभीर चेतावनी',
    },
    mobile: {
      myLocationRisk: 'आपके स्थान का जोखिम स्तर',
      reportIncident: 'भूस्खलन/दरार की रिपोर्ट करें',
      roadStatus: 'सड़क मार्ग की स्थिति',
      sosEmergency: 'एसओएस आपातकालीन सहायता',
      offlineSaved: 'रिपोर्ट ऑफलाइन स्टोर हो गई',
      syncSuccess: 'सभी ऑफलाइन रिपोर्ट्स क्लाउड में सिंक हो गईं',
      verifyWorkflow: 'अधिकारी सत्यापन सूची',
    },
  },
  as: {
    appTitle: 'উত্তৰ-পূৰ্বাঞ্চল ভূমিস্খলন প্ৰাৰম্ভিক সতৰ্কতা প্ৰণালী',
    appSubtitle: 'উত্তৰ-পূব ভাৰতৰ বাবে এআই-চালিত বিপদাশংকা নিৰীক্ষণ আৰু দুৰ্যোগ প্ৰশমন মঞ্চ',
    commandCenter: 'নিয়ন্ত্ৰণ কক্ষ',
    mobileFieldApp: 'নাগৰিক আৰু ফিল্ড মবাইল এপ্প',
    online: 'লাইভ সংযোগী: সক্ৰিয়',
    offline: 'নিম্ন নেটৱৰ্ক: অফলাইন ম’ড',
    offlineNotice: 'কম নেটৱৰ্কত অফলাইন সঞ্চয় সক্ৰিয়। সংকেত পোৱাৰ লগে লগে সকলো তথ্য স্বয়ংক্রিয়ভাৱে ক্লাউডলৈ যাব।',
    kpis: {
      monitoredZones: 'নিৰীক্ষিত অঞ্চল',
      highRiskZones: 'অতি সংবেদনশীল স্থান',
      activeAlerts: 'সক্ৰিয় সতৰ্কবাৰ্তা',
      blockedRoads: 'অৱৰুদ্ধ ঘাইপথ',
      activeSensors: 'সক্ৰিয় চেন্সৰ',
      citizenReports: 'নাগৰিক আৰু ফিল্ড ৰিপ’ৰ্ট',
    },
    tabs: {
      gisMap: 'জিআইএছ মানচিত্ৰ',
      emergencyMatrix: 'জৰুৰী প্ৰাথমিকতা তালিকা',
      earlyWarnings: 'প্ৰাৰম্ভিক সতৰ্কবাৰ্তা',
      aiImageInspector: 'এআই দৃষ্টি পৰীক্ষণ',
      dataCollection: 'বতৰ আৰু চেন্সৰ তথ্য',
      historicalData: 'ঐতিহাসিক ভূমিস্খলন নথি',
    },
    filters: {
      allStates: 'সকলো ৮ খন ৰাজ্য',
      allRiskLevels: 'সকলো বিপদ শ্ৰেণী',
      layerSensors: 'চেন্সৰসমূহ',
      layerInfra: 'জৰুৰী প্ৰতিষ্ঠান',
      layerRoads: 'ৰাষ্ট্ৰীয় ঘাইপথ',
      layerHeatmap: 'বিপদ হিটমেপ',
    },
    riskLabels: {
      LOW: 'স্বাভাৱিক অৱস্থা',
      MODERATE: 'মধ্যমীয়া বিপদ',
      HIGH: 'উচ্চ বিপদ',
      CRITICAL: 'চৰম বিপদ সংকেত',
    },
    mobile: {
      myLocationRisk: 'আপোনাৰ স্থানৰ বিপদ স্তৰ',
      reportIncident: 'ভূমিস্খলনৰ তথ্য দিয়ক',
      roadStatus: 'পথৰ অৱস্থা পৰীক্ষা',
      sosEmergency: 'জৰুৰীকালীন সাহায্য (SOS)',
      offlineSaved: 'অফলাইন মেম’ৰীত জমা কৰা হ’ল',
      syncSuccess: 'সকলো অফলাইন তথ্য মূল ছাৰ্ভাৰলৈ প্ৰেৰণ হ’ল',
      verifyWorkflow: 'ফিল্ড বিষয়াৰ সত্যাপন',
    },
  },
  bn: {
    appTitle: 'উত্তর-পূর্ব ভারত ভূমিধস পূর্ব সতর্কতা ব্যবস্থা',
    appSubtitle: 'উত্তর-পূর্বাঞ্চলের জন্য কৃত্রিম বুদ্ধিমত্তা চালিত ঝুঁকি পর্যবেক্ষণ ও দুর্যোগ ব্যবস্থাপনা',
    commandCenter: 'নিয়ন্ত্রণ কক্ষ',
    mobileFieldApp: 'নাগরিক ও ফিল্ড মোবাইল অ্যাপ',
    online: 'লাইভ সংযোগ: সক্রিয়',
    offline: 'স্বল্প নেটওয়ার্ক: অফলাইন মোড',
    offlineNotice: 'কম ব্যান্ডউইথে অফলাইন মোড চলছে। সংকেত পেলেই সমস্ত রিপোর্ট সেন্ট্রাল ডেটাবেসে সিঙ্ক হবে।',
    kpis: {
      monitoredZones: 'পর্যবেক্ষিত অঞ্চল',
      highRiskZones: 'উচ্চ ঝুঁকিপূর্ণ এলাকা',
      activeAlerts: 'সক্রিয় জরুরি সতর্কতা',
      blockedRoads: 'অবরুদ্ধ জাতীয় সড়ক',
      activeSensors: 'সক্রিয় আইওটি সেন্সর',
      citizenReports: 'ফিল্ড ও নাগরিক রিপোর্ট',
    },
    tabs: {
      gisMap: 'জিআইএস ঝুঁকি মানচিত্র',
      emergencyMatrix: 'জরুরি অগ্রাধিকার তালিকা',
      earlyWarnings: 'পূর্ব সতর্কতা বুলেটিন',
      aiImageInspector: 'এআই ফাটল ও ভূমিধস বিশ্লেষণ',
      dataCollection: 'সেন্সর ও আবহাওয়া ডেটা',
      historicalData: 'ঐতিহাসিক ভূমিধস তথ্যভাণ্ডার',
    },
    filters: {
      allStates: 'সমস্ত ৮টি রাজ্য',
      allRiskLevels: 'সমস্ত ঝুঁকি স্তর',
      layerSensors: 'আইওটি সেন্সর',
      layerInfra: 'গুরুত্বপূর্ণ পরিকাঠামো',
      layerRoads: 'জাতীয় সড়ক',
      layerHeatmap: 'ঝুঁকি হিটম্যাপ',
    },
    riskLabels: {
      LOW: 'স্বাভাবিক অবস্থা',
      MODERATE: 'মাঝারি ঝুঁকি',
      HIGH: 'উচ্চ ঝুঁকি',
      CRITICAL: 'চরম বিপজ্জনক',
    },
    mobile: {
      myLocationRisk: 'আপনার বর্তমান এলাকার ঝুঁকি',
      reportIncident: 'ভূমিধস/ফাটলের রিপোর্ট দিন',
      roadStatus: 'সড়ক পথের অবস্থা',
      sosEmergency: 'জরুরি এসওএস বার্তা',
      offlineSaved: 'অফলাইন মেমরিতে সংরক্ষিত হয়েছে',
      syncSuccess: 'সমস্ত অফলাইন রিপোর্ট সফলভাবে সিঙ্ক হয়েছে',
      verifyWorkflow: 'ফিল্ড অফিসার যাচাইকরণ তালিকা',
    },
  },
};
