/* eslint-disable @typescript-eslint/no-explicit-any */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "../index";
import {
  categories,
  brands,
  products,
  headphonesSpecs,
  productImages,
  productVariants,
} from "../schema";
import { eq } from "drizzle-orm";

import { getImagesFromFolder } from "../utils/imagekit-helper";

function groupHeadphonesByModel(files: any[]) {
  const grouped = files.reduce((acc: any, file: any) => {
    const baseName = file.name
      .replace(/\.(jpg|jpeg|png|webp)$/i, "")
      .replace(/[-\s]+(v1|v2|V1|V2)$/i, "")
      .trim();

    const colorMatch = baseName.match(
      /[-\s](black|white|silver|gold|grey|gray|red|blue|green|pink|purple|orange|yellow|brown|tan|multi|multicolor|light[-\s]?yellow|light[-\s]?pink|light[-\s]?green|matte[-\s]?black|white[-\s]?silver|white[-\s]?multi|black[-\s]?tan|brown[-\s]?white|blue2)$/i
    );
    const color = colorMatch
      ? colorMatch[1].toLowerCase().replace(/[-\s]/g, "-")
      : "default";

    const modelName = baseName
      .replace(
        /[-\s](black|white|silver|gold|grey|gray|red|blue|green|pink|purple|orange|yellow|brown|tan|multi|multicolor|light[-\s]?yellow|light[-\s]?pink|light[-\s]?green|matte[-\s]?black|white[-\s]?silver|white[-\s]?multi|black[-\s]?tan|brown[-\s]?white|blue2)$/i,
        ""
      )
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .toLowerCase()
      .trim();

    if (!acc[modelName]) {
      acc[modelName] = {
        model: modelName,
        colors: {},
      };
    }

    if (!acc[modelName].colors[color]) {
      acc[modelName].colors[color] = [];
    }

    acc[modelName].colors[color].push({
      ...file,
      detectedColor: color,
    });

    return acc;
  }, {});

  return grouped;
}

// Headphones database - All 14 models
const headphonesDatabase: Record<string, any> = {
  "sony-wf-c510-earbuds": {
    name: "Sony WF-C510 Earbuds",
    category: "headphones",
    brand: "sony",
    model: "WF-C510",
    sku: "SONY-WFC510-2024",
    warranty: "1 Year Sony India Warranty",
    releaseYear: 2024,
    basePrice: "5990.00",
    salePrice: "4990.00",
    isNewArrival: true,
    isBestseller: true,
    isFeatured: false,
    metaTitle: "Sony WF-C510 Earbuds - True Wireless Earbuds",
    metaDescription:
      "Sony WF-C510 true wireless earbuds with 20-hour battery life, splash-proof design, and clear sound.",
    specs: {
      headphoneType: "In-Ear",
      formFactor: "True Wireless",
      driverSize: "6mm",
      frequencyResponse: "20Hz - 20kHz",
      impedance: "N/A",
      sensitivity: "N/A",
      audioCodecs: ["AAC", "SBC"],
      anc: false,
      ancLevels: null,
      ambientMode: true,
      connectionType: "Bluetooth",
      bluetooth: "5.3",
      bluetoothRange: "10m",
      multipoint: false,
      audioJack: false,
      batteryLife: "Up to 11 hours",
      batteryLifeWithANC: null,
      chargingTime: "3 hours",
      quickCharge: true,
      wirelessCharging: false,
      chargingCase: true,
      caseBatteryLife: "20 hours total",
      microphone: true,
      micType: "Built-in",
      callQuality: "Good",
      controls: "Button controls",
      touchControls: false,
      voiceAssistant: true,
      weight: "4.6",
      foldable: false,
      sweatResistant: true,
      waterResistance: "IPX4",
      colors: ["Black", "Light Yellow", "Blue", "White"],
      earTips: "3 sizes included",
      adjustableBand: false,
      features: ["360 Reality Audio", "DSEE", "Quick charging"],
    },
  },

  "sony-wh-1000xm4": {
    name: "Sony WH-1000XM4",
    category: "headphones",
    brand: "sony",
    model: "WH-1000XM4",
    sku: "SONY-WH1000XM4-2024",
    warranty: "1 Year Sony India Warranty",
    releaseYear: 2024,
    basePrice: "29990.00",
    salePrice: "24990.00",
    isNewArrival: false,
    isBestseller: true,
    isFeatured: true,
    metaTitle: "Sony WH-1000XM4 - Premium Noise Canceling Headphones",
    metaDescription:
      "Sony WH-1000XM4 with industry-leading noise cancellation, 30-hour battery, and exceptional sound quality.",
    specs: {
      headphoneType: "Over-Ear",
      formFactor: "Wireless",
      driverSize: "40mm",
      frequencyResponse: "4Hz - 40kHz",
      impedance: "47Ω",
      sensitivity: "104.5dB/mW",
      audioCodecs: ["LDAC", "AAC", "SBC"],
      anc: true,
      ancLevels: "Adaptive",
      ambientMode: true,
      connectionType: "Bluetooth",
      bluetooth: "5.0",
      bluetoothRange: "10m",
      multipoint: true,
      audioJack: true,
      batteryLife: "Up to 30 hours",
      batteryLifeWithANC: "Up to 30 hours",
      chargingTime: "3 hours",
      quickCharge: true,
      wirelessCharging: false,
      chargingCase: true,
      caseBatteryLife: null,
      microphone: true,
      micType: "5 microphones",
      callQuality: "Excellent",
      controls: "Touch controls",
      touchControls: true,
      voiceAssistant: true,
      weight: "254",
      foldable: true,
      sweatResistant: false,
      waterResistance: null,
      colors: ["Black", "Blue", "Gold", "Silver"],
      earTips: null,
      adjustableBand: true,
      features: [
        "LDAC",
        "Speak-to-Chat",
        "Adaptive Sound Control",
        "DSEE Extreme",
      ],
    },
  },

  "sony-1000-xm5-earbuds": {
    name: "Sony WF-1000XM5 Earbuds",
    category: "headphones",
    brand: "sony",
    model: "WF-1000XM5",
    sku: "SONY-WF1000XM5-2024",
    warranty: "1 Year Sony India Warranty",
    releaseYear: 2024,
    basePrice: "24990.00",
    salePrice: "21990.00",
    isNewArrival: true,
    isBestseller: true,
    isFeatured: true,
    metaTitle: "Sony WF-1000XM5 - Premium True Wireless Earbuds",
    metaDescription:
      "Sony WF-1000XM5 with best-in-class ANC, LDAC support, and 8-hour battery life.",
    specs: {
      headphoneType: "In-Ear",
      formFactor: "True Wireless",
      driverSize: "8.4mm",
      frequencyResponse: "20Hz - 40kHz",
      impedance: "N/A",
      sensitivity: "N/A",
      audioCodecs: ["LDAC", "AAC", "SBC"],
      anc: true,
      ancLevels: "Adaptive",
      ambientMode: true,
      connectionType: "Bluetooth",
      bluetooth: "5.3",
      bluetoothRange: "10m",
      multipoint: true,
      audioJack: false,
      batteryLife: "Up to 8 hours",
      batteryLifeWithANC: "Up to 8 hours",
      chargingTime: "2 hours",
      quickCharge: true,
      wirelessCharging: true,
      chargingCase: true,
      caseBatteryLife: "24 hours total",
      microphone: true,
      micType: "6 microphones",
      callQuality: "Excellent",
      controls: "Touch controls",
      touchControls: true,
      voiceAssistant: true,
      weight: "5.9",
      foldable: false,
      sweatResistant: true,
      waterResistance: "IPX4",
      colors: ["Black", "White"],
      earTips: "4 sizes included",
      adjustableBand: false,
      features: [
        "LDAC",
        "DSEE Extreme",
        "Speak-to-Chat",
        "Bone conduction sensor",
      ],
    },
  },

  "sony-20wh-2dch720n": {
    name: "Sony WH-CH720N",
    category: "headphones",
    brand: "sony",
    model: "WH-CH720N",
    sku: "SONY-CH720N-2024",
    warranty: "1 Year Sony India Warranty",
    releaseYear: 2024,
    basePrice: "9990.00",
    salePrice: "7990.00",
    isNewArrival: false,
    isBestseller: true,
    isFeatured: false,
    metaTitle: "Sony WH-CH720N - Lightweight Noise Canceling Headphones",
    metaDescription:
      "Sony WH-CH720N with ANC, 35-hour battery, and lightweight design perfect for everyday use.",
    specs: {
      headphoneType: "Over-Ear",
      formFactor: "Wireless",
      driverSize: "30mm",
      frequencyResponse: "7Hz - 20kHz",
      impedance: "325Ω",
      sensitivity: "97dB/mW",
      audioCodecs: ["AAC", "SBC"],
      anc: true,
      ancLevels: "Single level",
      ambientMode: true,
      connectionType: "Bluetooth",
      bluetooth: "5.2",
      bluetoothRange: "10m",
      multipoint: true,
      audioJack: true,
      batteryLife: "Up to 35 hours",
      batteryLifeWithANC: "Up to 35 hours",
      chargingTime: "3.5 hours",
      quickCharge: true,
      wirelessCharging: false,
      chargingCase: false,
      caseBatteryLife: null,
      microphone: true,
      micType: "Built-in",
      callQuality: "Good",
      controls: "Button controls",
      touchControls: false,
      voiceAssistant: true,
      weight: "192",
      foldable: true,
      sweatResistant: false,
      waterResistance: null,
      colors: ["Black", "White", "Silver", "Red", "MultiColor", "White-Silver"],
      earTips: null,
      adjustableBand: true,
      features: ["DSEE", "Adaptive Sound Control", "Precise Voice Pickup"],
    },
  },

  "sny-mdr-mv1": {
    name: "Sony MDR-MV1",
    category: "headphones",
    brand: "sony",
    model: "MDR-MV1",
    sku: "SONY-MDRMV1-2024",
    warranty: "1 Year Sony India Warranty",
    releaseYear: 2024,
    basePrice: "29990.00",
    salePrice: null,
    isNewArrival: true,
    isBestseller: false,
    isFeatured: true,
    metaTitle: "Sony MDR-MV1 - Professional Studio Monitor Headphones",
    metaDescription:
      "Sony MDR-MV1 open-back studio headphones with spatial audio and professional sound quality.",
    specs: {
      headphoneType: "Over-Ear",
      formFactor: "Wired",
      driverSize: "40mm",
      frequencyResponse: "5Hz - 80kHz",
      impedance: "24Ω",
      sensitivity: "100dB/mW",
      audioCodecs: null,
      anc: false,
      ancLevels: null,
      ambientMode: false,
      connectionType: "Wired",
      bluetooth: null,
      bluetoothRange: null,
      multipoint: false,
      audioJack: true,
      batteryLife: null,
      batteryLifeWithANC: null,
      chargingTime: null,
      quickCharge: false,
      wirelessCharging: false,
      chargingCase: false,
      caseBatteryLife: null,
      microphone: false,
      micType: null,
      callQuality: null,
      controls: null,
      touchControls: false,
      voiceAssistant: false,
      weight: "223",
      foldable: false,
      sweatResistant: false,
      waterResistance: null,
      colors: ["Black"],
      earTips: null,
      adjustableBand: true,
      features: ["Open-back design", "360 Spatial Sound", "Hi-Res Audio"],
    },
  },

  "skullcandy-dime-3": {
    name: "Skullcandy Dime 3",
    category: "headphones",
    brand: "skullcandy",
    model: "Dime 3",
    sku: "SKULL-DIME3-2024",
    warranty: "1 Year Skullcandy Warranty",
    releaseYear: 2024,
    basePrice: "2499.00",
    salePrice: "1999.00",
    isNewArrival: true,
    isBestseller: true,
    isFeatured: false,
    metaTitle: "Skullcandy Dime 3 - Affordable True Wireless Earbuds",
    metaDescription:
      "Skullcandy Dime 3 budget earbuds with 12-hour battery and clear sound quality.",
    specs: {
      headphoneType: "In-Ear",
      formFactor: "True Wireless",
      driverSize: "6mm",
      frequencyResponse: "20Hz - 20kHz",
      impedance: "N/A",
      sensitivity: "N/A",
      audioCodecs: ["SBC"],
      anc: false,
      ancLevels: null,
      ambientMode: false,
      connectionType: "Bluetooth",
      bluetooth: "5.2",
      bluetoothRange: "10m",
      multipoint: false,
      audioJack: false,
      batteryLife: "Up to 4 hours",
      batteryLifeWithANC: null,
      chargingTime: "1 hour",
      quickCharge: false,
      wirelessCharging: false,
      chargingCase: true,
      caseBatteryLife: "12 hours total",
      microphone: true,
      micType: "Built-in",
      callQuality: "Good",
      controls: "Button controls",
      touchControls: false,
      voiceAssistant: false,
      weight: "4",
      foldable: false,
      sweatResistant: true,
      waterResistance: "IPX4",
      colors: ["Black", "White", "Blue", "Red", "Grey"],
      earTips: "3 sizes included",
      adjustableBand: false,
      features: ["Clear Voice Smart Mic", "Tile finding technology"],
    },
  },

  "skullcandy-hesh-360": {
    name: "Skullcandy Hesh ANC",
    category: "headphones",
    brand: "skullcandy",
    model: "Hesh ANC",
    sku: "SKULL-HESHANC-2024",
    warranty: "1 Year Skullcandy Warranty",
    releaseYear: 2024,
    basePrice: "9999.00",
    salePrice: "7999.00",
    isNewArrival: false,
    isBestseller: true,
    isFeatured: false,
    metaTitle: "Skullcandy Hesh ANC - Affordable Noise Canceling",
    metaDescription:
      "Skullcandy Hesh ANC with active noise cancellation and 22-hour battery life.",
    specs: {
      headphoneType: "Over-Ear",
      formFactor: "Wireless",
      driverSize: "40mm",
      frequencyResponse: "20Hz - 20kHz",
      impedance: "32Ω",
      sensitivity: "100dB",
      audioCodecs: ["SBC"],
      anc: true,
      ancLevels: "4 modes",
      ambientMode: true,
      connectionType: "Bluetooth",
      bluetooth: "5.0",
      bluetoothRange: "10m",
      multipoint: false,
      audioJack: true,
      batteryLife: "Up to 22 hours",
      batteryLifeWithANC: "Up to 22 hours",
      chargingTime: "2 hours",
      quickCharge: true,
      wirelessCharging: false,
      chargingCase: false,
      caseBatteryLife: null,
      microphone: true,
      micType: "Built-in",
      callQuality: "Good",
      controls: "Button controls",
      touchControls: false,
      voiceAssistant: true,
      weight: "245",
      foldable: true,
      sweatResistant: false,
      waterResistance: null,
      colors: ["Black", "White", "Blue", "Silver", "Green", "Multi"],
      earTips: null,
      adjustableBand: true,
      features: ["Tile finding", "Personal Sound", "Rapid Charge"],
    },
  },

  "skullcandy-evo": {
    name: "Skullcandy Crusher Evo",
    category: "headphones",
    brand: "skullcandy",
    model: "Crusher Evo",
    sku: "SKULL-CRUSHEVO-2024",
    warranty: "1 Year Skullcandy Warranty",
    releaseYear: 2024,
    basePrice: "14999.00",
    salePrice: "11999.00",
    isNewArrival: false,
    isBestseller: true,
    isFeatured: true,
    metaTitle: "Skullcandy Crusher Evo - Sensory Bass Headphones",
    metaDescription:
      "Skullcandy Crusher Evo with adjustable sensory bass, 40-hour battery, and Personal Sound.",
    specs: {
      headphoneType: "Over-Ear",
      formFactor: "Wireless",
      driverSize: "40mm",
      frequencyResponse: "20Hz - 20kHz",
      impedance: "32Ω",
      sensitivity: "100dB",
      audioCodecs: ["SBC"],
      anc: false,
      ancLevels: null,
      ambientMode: false,
      connectionType: "Bluetooth",
      bluetooth: "5.0",
      bluetoothRange: "10m",
      multipoint: false,
      audioJack: true,
      batteryLife: "Up to 40 hours",
      batteryLifeWithANC: null,
      chargingTime: "2 hours",
      quickCharge: true,
      wirelessCharging: false,
      chargingCase: false,
      caseBatteryLife: null,
      microphone: true,
      micType: "Built-in",
      callQuality: "Good",
      controls: "Button controls",
      touchControls: false,
      voiceAssistant: true,
      weight: "308",
      foldable: true,
      sweatResistant: false,
      waterResistance: null,
      colors: ["Black", "Blue", "Brown", "Black-Tan", "Brown-White"],
      earTips: null,
      adjustableBand: true,
      features: [
        "Sensory Bass",
        "Personal Sound",
        "Tile finding",
        "Rapid Charge",
      ],
    },
  },

  "skullcandy-crusher-anc2": {
    name: "Skullcandy Crusher ANC 2",
    category: "headphones",
    brand: "skullcandy",
    model: "Crusher ANC 2",
    sku: "SKULL-CRUSHANC2-2024",
    warranty: "1 Year Skullcandy Warranty",
    releaseYear: 2024,
    basePrice: "24999.00",
    salePrice: "19999.00",
    isNewArrival: true,
    isBestseller: true,
    isFeatured: true,
    metaTitle: "Skullcandy Crusher ANC 2 - Premium Bass Headphones",
    metaDescription:
      "Skullcandy Crusher ANC 2 with active noise cancellation, sensory bass, and 50-hour battery.",
    specs: {
      headphoneType: "Over-Ear",
      formFactor: "Wireless",
      driverSize: "40mm",
      frequencyResponse: "20Hz - 20kHz",
      impedance: "32Ω",
      sensitivity: "100dB",
      audioCodecs: ["SBC"],
      anc: true,
      ancLevels: "4 modes",
      ambientMode: true,
      connectionType: "Bluetooth",
      bluetooth: "5.2",
      bluetoothRange: "10m",
      multipoint: true,
      audioJack: true,
      batteryLife: "Up to 50 hours",
      batteryLifeWithANC: "Up to 50 hours",
      chargingTime: "2 hours",
      quickCharge: true,
      wirelessCharging: false,
      chargingCase: false,
      caseBatteryLife: null,
      microphone: true,
      micType: "4 microphones",
      callQuality: "Excellent",
      controls: "Button controls",
      touchControls: false,
      voiceAssistant: true,
      weight: "308",
      foldable: true,
      sweatResistant: false,
      waterResistance: null,
      colors: ["Black", "Silver", "Brown"],
      earTips: null,
      adjustableBand: true,
      features: [
        "Sensory Bass",
        "Personal Sound",
        "Tile finding",
        "Multi-device pairing",
      ],
    },
  },

  "skullcandy-jib-true2": {
    name: "Skullcandy Jib True 2",
    category: "headphones",
    brand: "skullcandy",
    model: "Jib True 2",
    sku: "SKULL-JIBTRUE2-2024",
    warranty: "1 Year Skullcandy Warranty",
    releaseYear: 2024,
    basePrice: "1999.00",
    salePrice: "1499.00",
    isNewArrival: false,
    isBestseller: true,
    isFeatured: false,
    metaTitle: "Skullcandy Jib True 2 - Ultra Affordable Earbuds",
    metaDescription:
      "Skullcandy Jib True 2 budget earbuds with 9-hour battery and clear sound.",
    specs: {
      headphoneType: "In-Ear",
      formFactor: "True Wireless",
      driverSize: "6mm",
      frequencyResponse: "20Hz - 20kHz",
      impedance: "N/A",
      sensitivity: "N/A",
      audioCodecs: ["SBC"],
      anc: false,
      ancLevels: null,
      ambientMode: false,
      connectionType: "Bluetooth",
      bluetooth: "5.0",
      bluetoothRange: "10m",
      multipoint: false,
      audioJack: false,
      batteryLife: "Up to 3 hours",
      batteryLifeWithANC: null,
      chargingTime: "1 hour",
      quickCharge: false,
      wirelessCharging: false,
      chargingCase: true,
      caseBatteryLife: "9 hours total",
      microphone: true,
      micType: "Built-in",
      callQuality: "Average",
      controls: "Button controls",
      touchControls: false,
      voiceAssistant: false,
      weight: "4",
      foldable: false,
      sweatResistant: true,
      waterResistance: "IPX4",
      colors: ["Black", "Grey", "White", "Blue"],
      earTips: "3 sizes included",
      adjustableBand: false,
      features: ["Tile finding", "Clear Voice Smart Mic"],
    },
  },

  "jbl-510bt": {
    name: "JBL Tune 510BT",
    category: "headphones",
    brand: "jbl",
    model: "Tune 510BT",
    sku: "JBL-510BT-2024",
    warranty: "1 Year JBL India Warranty",
    releaseYear: 2024,
    basePrice: "3999.00",
    salePrice: "2999.00",
    isNewArrival: false,
    isBestseller: true,
    isFeatured: false,
    metaTitle: "JBL Tune 510BT - Wireless On-Ear Headphones",
    metaDescription:
      "JBL Tune 510BT with JBL Pure Bass sound, 40-hour battery, and lightweight design.",
    specs: {
      headphoneType: "On-Ear",
      formFactor: "Wireless",
      driverSize: "32mm",
      frequencyResponse: "20Hz - 20kHz",
      impedance: "32Ω",
      sensitivity: "103dB",
      audioCodecs: ["SBC"],
      anc: false,
      ancLevels: null,
      ambientMode: false,
      connectionType: "Bluetooth",
      bluetooth: "5.0",
      bluetoothRange: "10m",
      multipoint: false,
      audioJack: true,
      batteryLife: "Up to 40 hours",
      batteryLifeWithANC: null,
      chargingTime: "2 hours",
      quickCharge: true,
      wirelessCharging: false,
      chargingCase: false,
      caseBatteryLife: null,
      microphone: true,
      micType: "Built-in",
      callQuality: "Good",
      controls: "Button controls",
      touchControls: false,
      voiceAssistant: true,
      weight: "160",
      foldable: true,
      sweatResistant: false,
      waterResistance: null,
      colors: ["Black", "Blue", "White", "Light Pink"],
      earTips: null,
      adjustableBand: true,
      features: ["JBL Pure Bass", "Voice Assistant", "Multi-device support"],
    },
  },

  "jbl-tune-flex-earbuds": {
    name: "JBL Tune Flex Earbuds",
    category: "headphones",
    brand: "jbl",
    model: "Tune Flex",
    sku: "JBL-TUNEFLEX-2024",
    warranty: "1 Year JBL India Warranty",
    releaseYear: 2024,
    basePrice: "7999.00",
    salePrice: "5999.00",
    isNewArrival: true,
    isBestseller: true,
    isFeatured: false,
    metaTitle: "JBL Tune Flex - Ghost Edition True Wireless Earbuds",
    metaDescription:
      "JBL Tune Flex with Active Noise Cancellation, 32-hour battery, and open/sealed design.",
    specs: {
      headphoneType: "In-Ear",
      formFactor: "True Wireless",
      driverSize: "12mm",
      frequencyResponse: "20Hz - 20kHz",
      impedance: "N/A",
      sensitivity: "N/A",
      audioCodecs: ["AAC", "SBC"],
      anc: true,
      ancLevels: "Adaptive",
      ambientMode: true,
      connectionType: "Bluetooth",
      bluetooth: "5.2",
      bluetoothRange: "10m",
      multipoint: true,
      audioJack: false,
      batteryLife: "Up to 8 hours",
      batteryLifeWithANC: "Up to 6 hours",
      chargingTime: "2 hours",
      quickCharge: true,
      wirelessCharging: false,
      chargingCase: true,
      caseBatteryLife: "32 hours total",
      microphone: true,
      micType: "4 microphones",
      callQuality: "Excellent",
      controls: "Touch controls",
      touchControls: true,
      voiceAssistant: true,
      weight: "5.2",
      foldable: false,
      sweatResistant: true,
      waterResistance: "IPX4",
      colors: ["Black", "White", "Blue"],
      earTips: "Open/Sealed design, 4 sizes",
      adjustableBand: false,
      features: ["JBL Pure Bass", "4-mic tech", "VoiceAware", "Smart Ambient"],
    },
  },

  "jbl-endurance-peak-3-earbuds": {
    name: "JBL Endurance Peak 3 Earbuds",
    category: "headphones",
    brand: "jbl",
    model: "Endurance Peak 3",
    sku: "JBL-ENDPEAK3-2024",
    warranty: "1 Year JBL India Warranty",
    releaseYear: 2024,
    basePrice: "4999.00",
    salePrice: "3999.00",
    isNewArrival: true,
    isBestseller: true,
    isFeatured: false,
    metaTitle: "JBL Endurance Peak 3 - Sports True Wireless Earbuds",
    metaDescription:
      "JBL Endurance Peak 3 sports earbuds with 50-hour battery, IP68 rating, and Powerhook design.",
    specs: {
      headphoneType: "In-Ear",
      formFactor: "True Wireless",
      driverSize: "10mm",
      frequencyResponse: "20Hz - 20kHz",
      impedance: "N/A",
      sensitivity: "N/A",
      audioCodecs: ["SBC"],
      anc: false,
      ancLevels: null,
      ambientMode: true,
      connectionType: "Bluetooth",
      bluetooth: "5.2",
      bluetoothRange: "10m",
      multipoint: false,
      audioJack: false,
      batteryLife: "Up to 10 hours",
      batteryLifeWithANC: null,
      chargingTime: "2 hours",
      quickCharge: true,
      wirelessCharging: false,
      chargingCase: true,
      caseBatteryLife: "50 hours total",
      microphone: true,
      micType: "Built-in",
      callQuality: "Good",
      controls: "Button controls",
      touchControls: false,
      voiceAssistant: true,
      weight: "7.5",
      foldable: false,
      sweatResistant: true,
      waterResistance: "IP68",
      colors: ["Black", "White", "Blue", "Red"],
      earTips: "Powerhook with 3 sizes",
      adjustableBand: false,
      features: ["JBL Pure Bass", "IP68", "Powerhook", "Dual Connect"],
    },
  },

  "jbl-live-770nc": {
    name: "JBL Live 770NC",
    category: "headphones",
    brand: "jbl",
    model: "Live 770NC",
    sku: "JBL-LIVE770NC-2024",
    warranty: "1 Year JBL India Warranty",
    releaseYear: 2024,
    basePrice: "14999.00",
    salePrice: "11999.00",
    isNewArrival: true,
    isBestseller: true,
    isFeatured: true,
    metaTitle: "JBL Live 770NC - Premium Adaptive Noise Canceling",
    metaDescription:
      "JBL Live 770NC with Adaptive ANC, spatial audio, 65-hour battery, and premium sound.",
    specs: {
      headphoneType: "Over-Ear",
      formFactor: "Wireless",
      driverSize: "40mm",
      frequencyResponse: "20Hz - 20kHz",
      impedance: "32Ω",
      sensitivity: "105dB",
      audioCodecs: ["AAC", "SBC"],
      anc: true,
      ancLevels: "Adaptive",
      ambientMode: true,
      connectionType: "Bluetooth",
      bluetooth: "5.3",
      bluetoothRange: "10m",
      multipoint: true,
      audioJack: true,
      batteryLife: "Up to 65 hours",
      batteryLifeWithANC: "Up to 50 hours",
      chargingTime: "2 hours",
      quickCharge: true,
      wirelessCharging: false,
      chargingCase: false,
      caseBatteryLife: null,
      microphone: true,
      micType: "4 microphones",
      callQuality: "Excellent",
      controls: "Button controls",
      touchControls: false,
      voiceAssistant: true,
      weight: "240",
      foldable: true,
      sweatResistant: false,
      waterResistance: null,
      colors: ["Black", "White", "Blue", "Light Green"],
      earTips: null,
      adjustableBand: true,
      features: [
        "JBL Spatial Sound",
        "Personi-Fi",
        "Smart Ambient",
        "Multi-device",
      ],
    },
  },
};

const headphonesFolders = {
  Headphones: "headphones",
};

export async function seedHeadphones() {
  console.log("🎧 Seeding headphones with color variants...\n");

  const allBrands = await db.select().from(brands);
  const brandMap = new Map(allBrands.map((b) => [b.slug, b]));

  for (const [folderName, categorySlug] of Object.entries(headphonesFolders)) {
    console.log(`📁 Processing ${folderName}...`);

    const category = await db.query.categories.findFirst({
      where: eq(categories.slug, categorySlug),
    });

    if (!category) {
      console.log(`  ⚠️  Category not found: ${categorySlug}`);
      continue;
    }

    try {
      const result = await getImagesFromFolder(folderName, 100);

      if (!result.success) {
        console.error(`  ❌ Error fetching images:`, result.error);
        continue;
      }

      console.log(`  🖼️  Found ${result.files.length} images`);

      // Group by model and color
      const groupedByModel = groupHeadphonesByModel(result.files);
      console.log(
        `  📦 Grouped into ${Object.keys(groupedByModel).length} models\n`
      );

      for (const [modelKey, modelData] of Object.entries(groupedByModel)) {
        const headphonesData = headphonesDatabase[modelKey];

        if (!headphonesData) {
          console.log(`  ⚠️  No specs found for: ${modelKey} (skipping)`);
          continue;
        }

        const brandId = brandMap.get(headphonesData.brand)?.id || null;

        // Get main image (first color variant)
        const firstColor = Object.keys((modelData as any).colors)[0];
        const mainImage = (modelData as any).colors[firstColor][0];

        // Create main product
        const [product] = await db
          .insert(products)
          .values({
            name: headphonesData.name,
            slug: `${categorySlug}-${modelKey}`,
            description: `${headphonesData.name} ${
              headphonesData.specs.headphoneType
            } ${headphonesData.specs.formFactor} headphones featuring ${
              headphonesData.specs.driverSize
            } drivers, ${
              headphonesData.specs.anc
                ? "Active Noise Cancellation"
                : "passive isolation"
            }, and ${headphonesData.specs.batteryLife || "wired connection"}. ${
              headphonesData.specs.features
                ? headphonesData.specs.features.join(", ")
                : ""
            }.`,
            shortDescription: `${headphonesData.specs.headphoneType} ${
              headphonesData.specs.formFactor
            }, ${headphonesData.specs.anc ? "ANC" : "No ANC"}, ${
              headphonesData.specs.batteryLife || "Wired"
            }`,
            categoryId: category.id,
            brandId,
            productType: "headphones",
            mainImagePath: mainImage.filePath.replace(/^\//, ""),
            basePrice: headphonesData.basePrice,
            salePrice: headphonesData.salePrice,
            model: headphonesData.model,
            sku: headphonesData.sku,
            warranty: headphonesData.warranty,
            releaseYear: headphonesData.releaseYear,
            isActive: true,
            isFeatured: headphonesData.isFeatured,
            isNewArrival: headphonesData.isNewArrival,
            isBestseller: headphonesData.isBestseller,
            stockQuantity: 0, // Stock managed by variants
            metaTitle: headphonesData.metaTitle,
            metaDescription: headphonesData.metaDescription,
            quickSpecs: {
              type: `${headphonesData.specs.headphoneType} ${headphonesData.specs.formFactor}`,
              driver: headphonesData.specs.driverSize,
              anc: headphonesData.specs.anc ? "Yes" : "No",
              battery: headphonesData.specs.batteryLife || "Wired",
              bluetooth: headphonesData.specs.bluetooth,
              weight: `${headphonesData.specs.weight}g`,
            },
          })
          .returning();

        // Create headphones specifications
        await db.insert(headphonesSpecs).values({
          productId: product.id,
          ...headphonesData.specs,
        });

        // Create color variants
        let variantIndex = 0;
        for (const [color, images] of Object.entries(
          (modelData as any).colors
        )) {
          const colorImages = images as any[];
          const variantImage = colorImages[0];

          // Create product variant
          await db.insert(productVariants).values({
            productId: product.id,
            variantName: `${headphonesData.name} - ${
              color === "default"
                ? "Standard"
                : color.charAt(0).toUpperCase() +
                  color.slice(1).replace(/-/g, " ")
            }`,
            sku: `${headphonesData.sku}-${color
              .toUpperCase()
              .replace(/-/g, "")}`,
            color:
              color === "default"
                ? null
                : color.charAt(0).toUpperCase() +
                  color.slice(1).replace(/-/g, " "),
            storage: null,
            ram: null,
            size: null,
            price: headphonesData.basePrice,
            salePrice: headphonesData.salePrice,
            stockQuantity: 20,
            lowStockThreshold: 5,
            imagePath: variantImage.filePath.replace(/^\//, ""),
            isActive: true,
            isDefault: variantIndex === 0,
          });

          variantIndex++;
        }

        // Create product images (all color variants)
        let imageIndex = 0;
        for (const [color, images] of Object.entries(
          (modelData as any).colors
        )) {
          const colorImages = images as any[];

          for (const file of colorImages) {
            await db.insert(productImages).values({
              productId: product.id,
              imagePath: file.filePath.replace(/^\//, ""),
              imageKitFileId: file.fileId,
              altText: `${headphonesData.name} - ${color}`,
              isMainImage: imageIndex === 0,
              displayOrder: imageIndex,
              width: file.width,
              height: file.height,
              imageType: color === "default" ? "front" : `color-${color}`,
            });

            imageIndex++;
          }
        }

        console.log(
          `  ✅ ${headphonesData.name} (${
            Object.keys((modelData as any).colors).length
          } colors, ${imageIndex} images)`
        );
      }
    } catch (error) {
      console.error(`  ❌ Error processing ${folderName}:`, error);
    }
  }

  console.log("\n🎉 All headphones seeded successfully!\n");
}

if (require.main === module) {
  seedHeadphones()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("❌ Error:", error);
      process.exit(1);
    });
}
