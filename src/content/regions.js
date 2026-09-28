const tooth = (name) => /tooth|incisor|canine|molar|premolar/i.test(name);

const skull = [
  "Frontal bone",
  "Parietal bone left",
  "Parietal bone right",
  "Occipital bone",
  "Sphenoid bone",
  "Ethmoid Bone",
  "Mandible bone",
  "Vomer",
  "Temporal bone.r",
  "Temporal bone.l",
  "Maxilla bone.r",
  "Maxilla bone.l",
  "Zygomatic bone.r",
  "Zygomatic bone.l",
  "Nasal bone.r",
  "Nasal bone.l",
  "Lacrimal bone.r",
  "Lacrimal bone.l",
  "Palatine bone.r",
  "Palatine bone.l",
  "Inferior nasal concha bone.r",
  "Inferior nasal concha bone.l",
];

const vertebrae = [
  "Atlas (C1)",
  "Axis (C2)",
  "Cervical vertebrae (C3)",
  "Cervical vertebrae (C4)",
  "Cervical vertebrae (C5)",
  "Cervical vertebrae (C6)",
  "Cervical vertebrae (C7)",
  "Thoracic vertebrae (T1)",
  "Thoracic vertebrae (T2)",
  "Thoracic vertebrae (T3)",
  "Thoracic vertebrae (T4)",
  "Thoracic vertebrae (T5)",
  "Thoracic vertebrae (T6)",
  "Thoracic vertebrae (T7)",
  "Thoracic vertebrae (T8)",
  "Thoracic vertebrae (T9)",
  "Thoracic vertebrae (T10)",
  "Thoracic vertebrae (T11)",
  "Thoracic vertebrae (T12)",
  "Lumbar vertebrae (L1)",
  "Lumbar vertebrae (L2)",
  "Lumbar vertebrae (L3)",
  "Lumbar vertebrae (L4)",
  "Lumbar vertebrae (L5)",
  "Sacrum",
  "Coccyx",
];

function both(name) {
  return [name, name.replace(/\.r\.?$/, ".l")];
}

function paired(names) {
  return names.flatMap((name) => both(name));
}

function spot(id, mesh, en, zh, fnEn, fnZh, extra = {}) {
  return { id, mesh, en, zh, fnEn, fnZh, ...extra };
}

function ribs() {
  const names = ["Body of sternum", "Manubrium of sternum"];
  for (let i = 1; i <= 12; i++) {
    const label = i === 1 ? "1st" : i === 2 ? "2nd" : i === 3 ? "3rd" : `${i}th`;
    names.push(...both(`Rib (${label}).r`));
    if (i <= 10) names.push(...both(`Costal cart of ${label} rib.r`));
  }
  return names;
}

export const REGIONS = [
  {
    id: "skeleton",
    group: "Overview",
    en: "Entire skeleton",
    systemEn: "Skeletal System",
    systemZh: "骨骼系統",
    focus: null,
    spots: [
      spot("skull", "Frontal bone", "Head", "頭部", "The skull sits at the top of the standing body and houses the brain.", "顱骨位於站立身體的最上端，容納腦。"),
      spot("neck", "Cervical vertebrae (C7)", "Neck", "頸部", "The lower neck is the seventh cervical vertebra, just above the thorax.", "頸部下端是第七頸椎，緊接胸廓上方。"),
      spot("chest", "Body of sternum", "Chest", "胸部", "The sternum lies in the midline of the chest, in front of the heart and lungs.", "胸骨位於胸前正中，心與肺的前方。"),
      spot("shoulder", "Clavicle.r", "Shoulder", "肩", "The clavicle runs from the sternum out to the shoulder.", "鎖骨自胸骨向外連到肩部。", { along: 0.45 }),
      spot("arm", "Humerus.r", "Arm", "上臂", "The humerus hangs at the side of the chest, from shoulder to elbow.", "肱骨垂於胸廓兩側，連接肩與肘。", { along: 0.5 }),
      spot("abdomen", "Lumbar vertebrae (L3)", "Abdomen", "腹部", "The lumbar spine is the bony column behind the abdomen.", "腰椎是腹部後方的骨性支柱。"),
      spot("hip", "Hip bone.r", "Hip", "髖", "The hip bone forms the side of the pelvis, where the thigh joins the trunk.", "髖骨構成骨盆側壁，大腿在此連於軀幹。", { along: 0.72, dir: [-1, 0.2, 0.5] }),
      spot("thigh", "Femur.r", "Thigh", "大腿", "The femur is the bone of the thigh, between hip and knee.", "股骨是大腿的骨，介於髖與膝之間。", { along: 0.5 }),
      spot("leg", "Tibia.r", "Leg", "小腿", "The tibia is the weight-bearing bone of the leg, from knee to ankle.", "脛骨是小腿的承重骨，從膝連到踝。", { along: 0.45 }),
      spot("foot", "Calcaneus.r", "Heel", "足跟", "The calcaneus is the heel bone, the posterior pillar of the foot.", "跟骨是足跟的骨，構成足的後側支柱。"),
    ],
  },
  {
    id: "skull",
    group: "Axial Skeleton",
    en: "Skull",
    systemEn: "Axial Skeleton",
    systemZh: "中軸骨",
    focus: skull,
    extra: tooth,
    spots: [
      spot("frontal", "Frontal bone", "Frontal Bone", "額骨", "It forms the forehead and the roof of each orbit.", "額骨構成前額，並形成兩側眼眶的頂。"),
      spot("parietal", "Parietal bone right", "Parietal Bone", "頂骨", "The two parietal bones meet at the top of the cranial vault.", "左右頂骨在顱頂相接，構成顱蓋的上部。", { dir: [0.4, 1, 0.2] }),
      spot("occipital", "Occipital bone", "Occipital Bone", "枕骨", "It forms the back and the base of the cranium. Turn the model to see it.", "枕骨構成顱腔的後壁與底部。把模型轉到後方即可看見。", { dir: [0, 0.3, -1] }),
      spot("temporal", "Temporal bone.r", "Temporal Bone", "顳骨", "It forms the side of the cranium, houses the ear, and meets the jaw.", "顳骨構成顱腔側壁，容納耳的結構，並與下頜相接。"),
      spot("nasal", "Nasal bone.r", "Nasal Bone", "鼻骨", "The small nasal bones form the bridge of the nose.", "細小的鼻骨構成鼻梁。"),
      spot("zygomatic", "Zygomatic bone.r", "Zygomatic Bone", "顴骨", "The cheek bone forms the lateral rim of the orbit.", "顴骨構成面頰，並形成眼眶的外側緣。"),
      spot("maxilla", "Maxilla bone.r", "Maxilla", "上頜骨", "The upper jaw holds the upper teeth and forms the floor of the orbit.", "上頜骨承載上排牙齒，並構成眼眶的底。"),
      spot("mandible", "Mandible bone", "Mandible", "下頜骨", "The only movable bone of the skull. It carries the lower teeth.", "下頜骨是顱骨中唯一可動的骨，承載下排牙齒。"),
    ],
  },
  {
    id: "spine",
    group: "Axial Skeleton",
    en: "Vertebral column",
    systemEn: "Axial Skeleton",
    systemZh: "中軸骨",
    focus: vertebrae,
    spots: [
      spot("atlas", "Atlas (C1)", "Atlas", "寰椎", "The first cervical vertebra supports the skull and lets the head nod.", "寰椎是第一頸椎，承托顱骨並允許點頭。"),
      spot("axis", "Axis (C2)", "Axis", "樞椎", "The second cervical vertebra lets the head turn from side to side.", "樞椎是第二頸椎，使頭能左右旋轉。"),
      spot("c7", "Cervical vertebrae (C7)", "Vertebra Prominens", "隆椎", "The seventh cervical vertebra is the bony prominence at the base of the neck.", "第七頸椎在頸根形成可觸及的骨性隆起。"),
      spot("t1", "Thoracic vertebrae (T1)", "First Thoracic Vertebra", "第一胸椎", "The first thoracic vertebra carries the first rib.", "第一胸椎與第一肋相連。"),
      spot("t7", "Thoracic vertebrae (T7)", "Seventh Thoracic Vertebra", "第七胸椎", "A mid-thoracic vertebra. Its rib helps form the middle of the cage.", "位於胸段中部的椎骨，其肋骨參與構成胸廓中段。"),
      spot("t12", "Thoracic vertebrae (T12)", "Twelfth Thoracic Vertebra", "第十二胸椎", "The last thoracic vertebra, where the rib cage gives way to the lumbar spine.", "最末一節胸椎，胸廓在此過渡為腰椎。"),
      spot("l3", "Lumbar vertebrae (L3)", "Third Lumbar Vertebra", "第三腰椎", "A large lumbar vertebra behind the abdomen. It carries the weight of the trunk.", "粗大的腰椎位於腹後，承受軀幹的重量。"),
      spot("sacrum", "Sacrum", "Sacrum", "薦骨", "Five fused vertebrae lock the spine between the hip bones.", "薦骨由五塊椎骨融合而成，嵌在兩側髖骨之間。"),
      spot("coccyx", "Coccyx", "Coccyx", "尾骨", "The small terminal piece of the column, below the sacrum.", "尾骨是脊柱末端的小椎骨，位於薦骨下方。"),
    ],
  },
  {
    id: "thorax",
    group: "Axial Skeleton",
    en: "Thoracic cage",
    systemEn: "Axial Skeleton",
    systemZh: "中軸骨",
    focus: ribs(),
    spots: [
      spot("manubrium", "Manubrium of sternum", "Manubrium", "胸骨柄", "The upper sternum, where the clavicles and the first ribs meet.", "胸骨柄是胸骨上部，鎖骨與第一肋在此相接。"),
      spot("body", "Body of sternum", "Body of the Sternum", "胸骨體", "The long middle piece of the sternum, in the front of the chest.", "胸骨體是胸骨中間的長段，位於胸前正中。"),
      spot("rib1", "Rib (1st).r", "First Rib", "第一肋", "The highest rib. It is short, flat, and sits at the root of the neck.", "第一肋最短而扁平，位於頸根。"),
      spot("rib5", "Rib (5th).r", "Fifth Rib", "第五肋", "A typical rib arches from the spine toward the sternum.", "典型的肋骨自脊柱弓向前方，朝向胸骨。"),
      spot("cartilage", "Costal cart of 5th rib.r", "Costal Cartilage", "肋軟骨", "This flexible bar joins the fifth rib to the sternum.", "這段有彈性的軟骨把第五肋連於胸骨。"),
      spot("rib12", "Rib (12th).r", "Twelfth Rib", "第十二肋", "The last rib is short and floats free of the sternum, low on the flank.", "第十二肋較短，不連胸骨，位於腰側。"),
    ],
  },
  {
    id: "upper",
    group: "Upper Limb",
    en: "Upper limb",
    systemEn: "Appendicular Skeleton",
    systemZh: "附肢骨",
    focus: paired([
      "Clavicle.r", "Scapula.r.", "Humerus.r", "Radius.r", "Ulna.r",
      "Scaphoid.r", "Lunate bone.r", "Triquetrum.r", "Pisiform.r",
      "Trapezium.r", "Trapezoid.r", "Capitate.r", "Hamate.r",
      "1st metacarpal bone.r", "2nd metacarpal bone.r", "3rd metacarpal bone.r", "4th metacarpal bone.r", "5th metacarpal bone.r",
      "Proximal phalanx of 1st finger.r", "Proximal phalanx of 2d finger.r", "Proximal phalanx of 3rd finger.r", "Proximal phalanx of 4th finger.r", "Proximal phalanx of 5th finger.r",
      "Middle phalanx of 2d finger.r", "Middle phalanx of 3rd finger.r", "Middle phalanx of 4th finger.r", "Middle phalanx of 5th finger.r",
      "Distal phalanx of 1st finger.r", "Distal phalanx of 2d finger.r", "Distal phalanx of 3d finger.r", "Distal phalanx of 4th finger.r", "Distal phalanx of 5th finger.r",
    ]),
    spots: [
      spot("clavicle", "Clavicle.r", "Clavicle", "鎖骨", "It braces the shoulder away from the trunk.", "鎖骨把肩帶撐離軀幹。", { along: 0.5 }),
      spot("scapula", "Scapula.r.", "Scapula", "肩胛骨", "The shoulder blade lies on the back of the chest. Turn the model to see its flat surface.", "肩胛骨貼於胸廓後方。把模型轉到背面可看見其扁平面。", { dir: [0, 0.2, -1] }),
      spot("humerus-prox", "Humerus.r", "Proximal Humerus", "肱骨近端", "The head of the humerus fits the shoulder socket.", "肱骨頭納入肩關節的關節盂。", { along: 0.86 }),
      spot("humerus", "Humerus.r", "Humeral Shaft", "肱骨幹", "The shaft of the arm bone descends along the side of the chest.", "肱骨幹沿胸廓外側下行。", { along: 0.5 }),
      spot("humerus-dist", "Humerus.r", "Distal Humerus", "肱骨遠端", "This end meets the radius and ulna at the elbow.", "此端與橈骨、尺骨構成肘關節。", { along: 0.14 }),
      spot("radius", "Radius.r", "Radius", "橈骨", "The lateral forearm bone. It crosses the ulna as the palm turns.", "橈骨位於前臂外側，掌心翻轉時繞尺骨旋轉。", { along: 0.45 }),
      spot("ulna", "Ulna.r", "Ulna", "尺骨", "The medial forearm bone. Its olecranon is the point of the elbow.", "尺骨位於前臂內側，鷹嘴構成肘尖。", { along: 0.7 }),
      spot("hand", "3rd metacarpal bone.r", "Metacarpal", "掌骨", "The metacarpals form the skeleton of the palm, beyond the wrist.", "掌骨構成手掌的骨架，位於腕骨遠側。"),
    ],
  },
  {
    id: "pelvis",
    group: "Lower Limb",
    en: "Pelvic girdle",
    systemEn: "Appendicular Skeleton",
    systemZh: "附肢骨",
    focus: [...both("Hip bone.r"), "Sacrum", "Coccyx"],
    spots: [
      spot("ilium", "Hip bone.r", "Ilium", "髂骨", "The broad upper part of the hip bone. The crest is the rim you can feel at the waist.", "髂骨是髖骨寬大的上部，髂嵴是腰側可觸及的骨緣。", { along: 0.9, dir: [0, 1, 0.25] }),
      spot("acetabulum", "Hip bone.r", "Acetabulum", "髖臼", "The socket on the outer side of the hip bone, for the head of the femur.", "髖臼在髖骨外側，容納股骨頭。", { along: 0.48, dir: [-1, 0, 0.35] }),
      spot("ischium", "Hip bone.r", "Ischium", "坐骨", "The lower, posterior part of the hip bone. You sit on the ischial tuberosity.", "坐骨是髖骨的後下部，坐骨結節是坐時的承重點。", { along: 0.1, dir: [0, -0.6, -0.8] }),
      spot("sacrum", "Sacrum", "Sacrum", "薦骨", "It wedges between the hip bones and completes the back of the pelvic ring.", "薦骨楔入兩側髖骨之間，構成骨盆環的後部。"),
      spot("coccyx", "Coccyx", "Coccyx", "尾骨", "The small terminal piece of the vertebral column, below the sacrum.", "尾骨是脊柱末端的小椎骨，位於薦骨下方。"),
    ],
  },
  {
    id: "lower",
    group: "Lower Limb",
    en: "Lower limb",
    systemEn: "Appendicular Skeleton",
    systemZh: "附肢骨",
    focus: paired([
      "Hip bone.r", "Femur.r", "Patella.r", "Tibia.r", "Fibula.r",
      "Calcaneus.r", "Talus.r", "Navicular bone.r", "Cuboid bone.r",
      "Medial cuneiform bone.r", "Intermediate cuneiform bone.r", "Lateral cuneiform bone.r",
      "First metatarsal bone.r", "Second metatarsal bone.r", "Third metatarsal bone.r", "Fourth metatarsal bone.r", "Fifth metatarsal bone.r",
    ]),
    spots: [
      spot("hip", "Hip bone.r", "Hip Bone", "髖骨", "The limb begins here, where the pelvis meets the thigh.", "下肢從這裡開始，骨盆與大腿在此相接。", { along: 0.55, dir: [-1, 0.1, 0.4] }),
      spot("femur", "Femur.r", "Femur", "股骨", "The thigh bone runs from the hip socket to the knee.", "股骨從髖臼下行到膝關節。", { along: 0.55 }),
      spot("patella", "Patella.r", "Patella", "髕骨", "The kneecap sits in front of the knee, in the tendon of the thigh.", "髕骨位於膝前方，嵌在大腿的肌腱中。"),
      spot("tibia", "Tibia.r", "Tibia", "脛骨", "The shin bone carries the body's weight from the knee to the ankle.", "脛骨把體重從膝關節傳到踝關節。", { along: 0.5 }),
      spot("fibula", "Fibula.r", "Fibula", "腓骨", "The slender bone on the outer side of the leg.", "腓骨是小腿外側細長的骨。", { along: 0.55, dir: [-1, 0, 0.3] }),
      spot("calcaneus", "Calcaneus.r", "Calcaneus", "跟骨", "The heel bone meets the ground at the back of the foot.", "跟骨在足後端接觸地面。"),
      spot("metatarsal", "First metatarsal bone.r", "First Metatarsal", "第一蹠骨", "It forms the bony base of the great toe.", "第一蹠骨構成踇趾的骨性基底。"),
    ],
  },
  {
    id: "femur",
    group: "Lower Limb",
    en: "Femur",
    systemEn: "Appendicular Skeleton",
    systemZh: "附肢骨",
    focus: both("Femur.r"),
    spots: [
      {
        id: "proximal",
        mesh: "Femur.r",
        along: 0.86,
        en: "Proximal Epiphysis",
        zh: "近側骨骺",
        fnEn: "The head and neck fit the hip socket. Spongy bone inside this end spreads the load of standing.",
        fnZh: "股骨頭與股骨頸納入髖臼。此端內部的鬆質骨可分散站立時的負重。",
      },
      {
        id: "shaft",
        mesh: "Femur.r",
        along: 0.5,
        en: "Diaphysis",
        zh: "骨幹",
        fnEn: "The shaft is a tube of compact bone. Its hollow medullary cavity holds bone marrow.",
        fnZh: "骨幹是緻密骨構成的骨管，中央的骨髓腔容納骨髓。",
      },
      {
        id: "distal",
        mesh: "Femur.r",
        along: 0.14,
        en: "Distal Epiphysis",
        zh: "遠側骨骺",
        fnEn: "The condyles at this end meet the tibia and form the knee joint.",
        fnZh: "此端的髁與脛骨相接，構成膝關節。",
      },
    ],
  },
];

export const LIBRARY = [];
for (const region of REGIONS) {
  let group = LIBRARY.find((entry) => entry.en === region.group);
  if (!group) {
    group = { en: region.group, organs: [] };
    LIBRARY.push(group);
  }
  group.organs.push({ id: region.id, en: region.en });
}

export const HOTSPOTS = Object.fromEntries(
  REGIONS.map((region) => [
    region.id,
    {
      systemEn: region.systemEn,
      systemZh: region.systemZh,
      items: Object.fromEntries(region.spots.map((spot) => [spot.id, spot])),
    },
  ])
);

export function regionById(id) {
  return REGIONS.find((region) => region.id === id);
}
