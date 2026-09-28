const view = (query) => `https://caskanatomy.info/open3dviewer/?${query}`;
const page = (slug) => `https://anatomytool.org/content/${slug}`;

function item(id, en, query, slug, note) {
  return {
    id,
    en,
    viewer: view(query),
    page: slug ? page(slug) : "https://anatomytool.org/open3dmodel-learn",
    note: note || "",
    local: false,
  };
}

const muscles = (id) => item(
  id,
  "Muscles of thorax, abdomen and back",
  "model=muscles-thorax-abdomen",
  "open3dmodel-muscles-thorax-abdomen-and-back-english-labels",
);

const attachments = (id) => item(
  id,
  "Muscle attachments",
  "model=insertions-and-origins",
  "open3dmodel-muscle-attachments-english-labels",
);

const spinal = item(
  "spinal-cord",
  "Spinal cord and surroundings",
  "model=spinal-cord",
  "open3dmodel-spinal-cord-and-surroundings-section-english-labels",
  "Includes the anterior and posterior radicular arteries beside the cord.",
);

const inguinal = item(
  "inguinal-canal",
  "Inguinal and femoral canal, surroundings",
  "model=inguinal-canal",
  "open3danatomy-3d-model-inguinal-and-femoral-canal-and-surrounding-regions-english-labels",
  "Includes the inferior epigastric artery and its connection with the obturator artery.",
);

const hernia = item(
  "inguinal-hernia",
  "Inguinal and femoral canal, hernia surgery",
  "model=inguinal-and-femoral-canal-hernia-surgery&subset=start",
  "open3danatomy-3d-model-inguinal-and-femoral-canal-and-structures-hernia-surgery",
  "Includes the inferior epigastric artery and the corona mortis connection.",
);

const nerves = [
  item("brachial-plexus", "Brachial plexus", "model=shoulder-brachial-plexus", "open3dmodel-brachial-plexus-english-labels"),
  item("brachial-branches", "Brachial plexus and supplied nerves", "model=brachial-plexus-and-branches", "open3dmodel-brachial-plexus-and-supplied-nerves-english-labels"),
  item("axillary-nerve", "Axillary nerve", "model=axillary-nerve", "open3dmodel-axillary-nerve-english-labels"),
  item("radial-nerve", "Radial nerve", "model=radial-nerve", "open3dmodel-radial-nerve-english-labels"),
  item("ulnar-nerve", "Ulnar nerve", "model=ulnar-nerve", "open3dmodel-ulnar-nerve-english-labels"),
  item("median-nerve", "Median nerve", "model=median-nerve", "open3dmodel-median-nerve-english-labels"),
  item("musculocutaneous-nerve", "Musculocutaneous nerve", "model=musculocutaneous-nerve", "open3dmodel-musculocutaneous-nerve-english-labels"),
];

export const CATALOG = [
  {
    en: "General",
    open: true,
    items: [
      {
        id: "skeleton",
        en: "Skeleton",
        local: true,
        viewer: null,
        page: page("open3dmodel-skeleton-english-labels"),
        note: "",
      },
      item("vertebrae", "Typical vertebrae", "model=vertebrae", "open3dmodel-typical-vertebrae-english-labels"),
    ],
  },
  {
    en: "Head",
    items: [
      item("skull", "Skull", "model=overview-skull", "open3dmodel-skull-english-labels"),
      item("coloured-skull", "Coloured skull", "model=overview-colored-skull", "open3dmodel-coloured-skull-english-labels"),
      item("exploded-skull", "Exploded view of the skull", "model=exploded-skull", "open3dmodel-exploded-view-skull-english-labels"),
      item("skull-base", "Coloured skull base", "model=colored-skull-base", "open3dmodel-coloured-skull-base-english-labels"),
    ],
  },
  {
    en: "Neck and back",
    items: [
      muscles("back-muscles"),
      attachments("back-attachments"),
      spinal,
    ],
  },
  {
    en: "Thorax",
    items: [
      muscles("thorax-muscles"),
      attachments("thorax-attachments"),
    ],
  },
  {
    en: "Abdomen",
    items: [
      muscles("abdomen-muscles"),
      attachments("abdomen-attachments"),
      inguinal,
      hernia,
      item("inguinal-ligament", "Inguinal ligament and related structures", "model=inguinal-ligament&subset=start", "open3danatomy-3d-model-inguinal-ligament-and-related-structures-english-labels"),
    ],
  },
  {
    en: "Pelvis and perineum",
    items: [
      item("pelvic-floor", "Pelvis and perineum", "model=pelvicfloor", "open3danatomy-3d-model-pelvic-floor-and-perineum-english-labels"),
      attachments("pelvis-attachments"),
    ],
  },
  {
    en: "Upper limb",
    groups: [
      {
        en: "Complete",
        items: [
          item("upper-complete", "Upper limb, complete", "model=upper-limb", "open3dmodel-upper-limb-english-labels"),
          item("shoulder-complete", "Shoulder, complete", "model=zone-shoulder", "open3dmodel-shoulder-english-labels"),
          item("elbow-complete", "Elbow, complete", "model=zone-elbow", "open3dmodel-elbow-english-labels"),
          item("hand-complete", "Hand, complete", "model=hand", ""),
        ],
      },
      {
        en: "Bones and joints",
        items: [
          item("upper-bones", "Upper limb, bones and cartilages", "model=upper-limb-bones-and-cartilages&subset=trunk-hidden", "open3dmodel-upper-limb-bones-and-cartilages-trunk-hidden-english-labels"),
          item("hand-bones", "Hand and wrist, bones and cartilages", "model=hand-and-wrist-bones-and-cartilages", "open3dmodel-hand-and-wrist-bones-and-cartilages-english-labels"),
          item("shoulder-joints", "Shoulder and pectoral girdle, joints", "model=shoulder-and-pectoral-girdle-joints&subset=ligament-parts-hidden", "open3dmodel-shoulder-and-pectoral-girdle-joints-ligament-parts-hidden-english-labels"),
          item("shoulder-joints-deep", "Shoulder joints, capsules and ligaments hidden", "model=shoulder-and-pectoral-girdle-joints&subset=capsules-and-ligaments-hidden", "open3dmodel-shoulder-and-pectoral-girdle-joints-capsules-and-ligaments-hidden-english-labels"),
          item("hand-joints", "Hand and wrist, joints", "model=hand-and-wrist-joints", "open3dmodel-hand-and-wrist-joints-english-labels"),
        ],
      },
      {
        en: "Muscles",
        items: [
          attachments("upper-attachments"),
          item("axio-parts", "Axio-appendicular muscles, parts hidden", "model=upper-limb-axio-appendicular-muscles&subset=muscle-and-ligament-parts-hidden", "open3dmodel-axio-appendicular-muscles-muscle-and-ligament-parts-hidden-english-labels"),
          item("axio-deep", "Axio-appendicular muscles, deep view", "model=upper-limb-axio-appendicular-muscles&subset=muscles-and-bursae-and-ligament-parts-hidden", "open3dmodel-axio-appendicular-muscles-muscles-and-bursae-and-ligament-parts-hidden-english-labels"),
          item("scapulo-parts", "Scapulohumeral muscles, parts hidden", "model=upper-limb-scapulohumeral-muscles&subset=muscle-bursa-and-ligament-parts-hidden", "open3dmodel-scapulohumeral-muscles-muscle-bursa-and-ligament-parts-hidden-english-labels"),
          item("scapulo-deep", "Scapulohumeral muscles, deep view", "model=upper-limb-scapulohumeral-muscles&subset=muscles-and-bursae-and-ligament-parts-hidden", "open3dmodel-scapulohumeral-muscles-muscles-and-bursae-and-ligament-parts-hidden-english-labels"),
          item("rotator-cuff", "Rotator cuff muscles", "model=rotator-cuff", "open3dmodel-rotator-cuff-muscles-english-labels"),
          item("arm-muscles", "Arm muscles", "model=upper-limb-arm-muscles&subset=ligament-parts-hidden", "open3dmodel-arm-muscles-ligament-parts-hidden-english-labels"),
          item("arm-muscles-deep", "Arm muscles, deep view", "model=upper-limb-arm-muscles&subset=muscles-and-bursae-and-ligament-parts-hidden", "open3dmodel-arm-muscles-muscles-and-bursae-and-ligament-parts-hidden-english-labels"),
          item("forearm-muscles", "Forearm, anterior compartment", "model=upper-limb-forearm-anterior-compartment-muscles", "open3dmodel-forearm-anterior-compartment-muscles-english-labels"),
          item("forearm-deep", "Forearm, muscles and sheaths hidden", "model=upper-limb-forearm-anterior-compartment-muscles&subset=muscles-and-sheaths-hidden", "open3dmodel-forearm-anterior-compartment-muscles-muscles-and-sheaths-hidden-english-labels"),
        ],
      },
      { en: "Nerves", items: nerves },
    ],
  },
  {
    en: "Lower limb",
    groups: [
      {
        en: "Complete",
        items: [
          item("lower-complete", "Lower limb, complete", "model=lower-limb", "open3dmodel-lower-limb-english-labels"),
          item("hip-complete", "Hip, complete", "model=zone-hip", "open3dmodel-hip-english-labels"),
          item("knee-complete", "Knee, complete", "model=zone-knee", "open3dmodel-knee-english-labels"),
          item("ankle-complete", "Ankle and foot, complete", "model=zone-ankle", "open3dmodel-ankle-and-foot-english-labels"),
        ],
      },
      {
        en: "Muscles",
        items: [
          attachments("lower-attachments"),
          item("abductors", "Abductors and rotators of the thigh", "model=muscles-gluteal-region-abductors-rotators-thigh", "open3dmodel-abductors-and-rotators-thigh-english-labels"),
          item("knee-extensors", "Extensors of the knee", "model=muscles-anterior-thigh-extensors-knee", "open3dmodel-extensors-knee-english-labels"),
          item("hip-flexors", "Flexors of the hip joint", "model=ant-thigh-hip-flexors", "open3dmodel-flexors-hip-joint-english-labels"),
          item("adductors", "Adductors of the thigh", "model=medial-thigh-adductors-of-thigh", "open3dmodel-adductors-thigh-english-labels"),
          item("leg-posterior", "Posterior compartment of the leg", "model=muscles-deep-superficial-posterior-comp-leg", "open3dmodel-muscles-posterior-compartment-leg-english-labels"),
        ],
      },
    ],
  },
  {
    en: "Nerves",
    items: nerves,
  },
  {
    en: "Vessels",
    items: [
      { ...spinal, id: "vessels-cord" },
      { ...inguinal, id: "vessels-inguinal" },
      { ...hernia, id: "vessels-hernia" },
    ],
  },
];

export function modelById(id) {
  for (const group of CATALOG) {
    const lists = group.groups ? group.groups.map((entry) => entry.items) : [group.items];
    for (const list of lists) {
      const found = list.find((entry) => entry.id === id);
      if (found) return found;
    }
  }
  return null;
}
