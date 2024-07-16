export interface Drop {
  item: string;
}

type Matcher = { [object: string]: string };

interface NodeMatcher {
  matchers: Matcher[];
  drops: Drop[];
}

export const tagMatchers: NodeMatcher[] = [
  {
    matchers: [{ amenity: "toilets" }],
    drops: [
      { item: "Toilet Paper" },
      { item: "Soap" },
      { item: "Used Syringe" },
    ],
  },
  {
    matchers: [
      {
        amenity: "toilets",
        male: "yes",
      },
    ],
    drops: [{ item: "Condom" }, { item: "Razor" }],
  },
  {
    matchers: [
      {
        amenity: "toilets",
        female: "yes",
      },
    ],
    drops: [{ item: "Tampon" }, { item: "Pad" }],
  },
  {
    matchers: [
      {
        amenity: "toilets",
        changing_table: "yes",
      },
    ],
    drops: [{ item: "Used Diaper" }],
  },
  {
    matchers: [{ amenity: "vending_machine" }],
    drops: [
      { item: "Drink Can" },
      { item: "Packet of Chips" },
      { item: "Chocolate Bar" },
      { item: "Energy Drink" },
      { item: "Water" },
    ],
  },
  {
    matchers: [{ amenity: "pub" }],
    drops: [
      { item: "Beer" },
      { item: "Beer Glass" },
      { item: "Cutlery" },
      { item: "Schnitzel" },
      { item: "Hot chips" },
      { item: "Billiard Ball" },
      { item: "Chair" },
      { item: "Ice" },
      { item: "Coaster" },
    ],
  },
  {
    matchers: [{ amenity: "cafe" }],
    drops: [
      { item: "Coffee" },
      { item: "Coffee Cup" },
      { item: "Menu" },
      { item: "Pastry" },
      { item: "Brownie" },
      { item: "Bacon" },
      { item: "Fried Egg" },
      { item: "Toast" },
    ],
  },
  {
    matchers: [{ amenity: "fast_food" }],
    drops: [{ item: "Disposable Cutlery" }, { item: "Paper Bag" }],
  },
  {
    matchers: [{ amenity: "fast_food", cuisine: "burger" }],
    drops: [{ item: "Burger" }, { item: "Ketchup" }, { item: "Fries" }],
  },
  {
    matchers: [{ amenity: "fast_food", cuisine: "kebab" }],
    drops: [
      { item: "Kebab" },
      { item: "Fries" },
      { item: "Ketchup" },
      { item: "Garlic Sauce" },
      { item: "BBQ Sauce" },
      { item: "Sweet Chilli Sauce" },
    ],
  },
  {
    matchers: [{ cuisine: "japanese" }],
    drops: [
      { item: "Soy Sauce" },
      { item: "Chopsticks" },
      { item: "Nori" },
      { item: "Sashimi" },
      { item: "Udon" },
      { item: "Sushi" },
      { item: "Tempura Prawn" },
      { item: "Karaage" },
    ],
  },
  {
    matchers: [{ shop: "convenience" }],
    drops: [
      { item: "Drink Can" },
      { item: "Packet of Chips" },
      { item: "Chocolate Bar" },
      { item: "Energy Drink" },
      { item: "Water" },
    ],
  },
  {
    matchers: [{ amenity: "bicycle_parking" }],
    drops: [{ item: "Helmet" }],
  },
  {
    matchers: [{ landuse: "residential" }],
    drops: [
      { item: "Keys" },
      { item: "Painting" },
      { item: "Sock" },
      { item: "Clothes Hanger" },
      { item: "Fork" },
      { item: "Spoon" },
      { item: "Knife" },
      { item: "Glass" },
      { item: "Mug" },
      { item: "Book" },
      { item: "Lampshade" },
      { item: "Underwear" },
      { item: "Paper Towel" },
      { item: "Soap" },
      { item: "Candle" },
      { item: "Headphones" },
      { item: "Coaster" },
      { item: "Coin" },
      { item: "Plate" },
      { item: "Egg" },
      { item: "Mouse" },
      { item: "Cable" },
      { item: "Hat" },
      { item: "Scarf" },
      { item: "Toothbrush" },
    ],
  },
  {
    matchers: [{ landuse: "residential", building: "terrace" }],
    drops: [{ item: "Brick" }, { item: "Plant Pot" }],
  },
  {
    matchers: [{ landuse: "residential", building: "apartments" }],
    drops: [{ item: "Key Card" }],
  },
  {
    matchers: [{ landuse: "commercial", building: "office" }],
    drops: [
      { item: "Paper" },
      { item: "Stapler" },
      { item: "Pen" },
      { item: "Mouse" },
      { item: "Paperclip" },
      { item: "Calculator" },
    ],
  },
  {
    matchers: [{ landuse: "retail" }],
    drops: [{ item: "Coin" }],
  },
  {
    matchers: [{ amenity: "bench" }, { bench: "yes" }],
    drops: [
      { item: "Empty Water Bottle" },
      { item: "Empty Can" },
      { item: "Plastic Bag" },
      { item: "Wrapper" },
    ],
  },
  {
    matchers: [{ amenity: "waste_basket" }, { bin: "yes" }],
    drops: [
      { item: "Empty Water Bottle" },
      { item: "Empty Can" },
      { item: "Plastic Bag" },
      { item: "Wrapper" },
    ],
  },
  {
    matchers: [{ amenity: "waste_basket", waste: "sharps" }],
    drops: [{ item: "Used Syringe" }],
  },
  {
    matchers: [{ amenity: "library" }],
    drops: [
      { item: "Paper" },
      { item: "Book" },
      { item: "Bookmark" },
      { item: "CD" },
      { item: "Computer Mouse" },
      { item: "Keyboard" },
      { item: "Magazine" },
      { item: "Chair" },
      { item: "Glasses" },
      { item: "Newspaper" },
    ],
  },
  {
    matchers: [{ amenity: "public_bookcase" }],
    drops: [{ item: "Book" }, { item: "Bookmark" }],
  },
  {
    matchers: [{ amenity: "drinking_water" }],
    drops: [{ item: "Dog bowl" }, { item: "Empty Water Bottle" }],
  },
  {
    matchers: [{ leisure: "fitness_centre" }],
    drops: [
      { item: "Wipe" },
      { item: "Used Wipe" },
      { item: "Water Bottle" },
      { item: "Protein Shake" },
      { item: "Energy Drink" },
      { item: "Towel" },
      { item: "Dumbbell" },
      { item: "Barbell" },
      { item: "Kettlebell" },
      { item: "Headphones" },
      { item: "Headband" },
      { item: "Phone" },
      { item: "Watch" },
    ],
  },
  {
    matchers: [{ artwork_type: "mural" }],
    drops: [{ item: "Spraypaint" }, { item: "Chalk" }],
  },
  {
    matchers: [{ man_made: "street_cabinet" }],
    drops: [{ item: "Wire" }],
  },
  {
    matchers: [{ barrier: "gate" }],
    drops: [
      { item: "Rusty Hinge" },
      { item: "Rusty Nut" },
      { item: "Rusty Bolt" },
      { item: "Padlock" },
      { item: "Chain" },
    ],
  },
  {
    matchers: [{ tactile_paving: "yes" }],
    drops: [{ item: "Rubber Circle" }],
  },
  {
    matchers: [{ departures_board: "realtime" }],
    drops: [{ item: "LED" }],
  },
  {
    matchers: [
      { railway: "platform" },
      { landuse: "railway" },
      { building: "train_station" },
      { railway: "station" },
      { public_transport: "station" },
      { railway: "stop" },
    ],
    drops: [
      { item: "Pebble" },
      { item: "Used Coffee Cup" },
      { item: "Train Ticket" },
      { item: "Headphones" },
    ],
  },
  {
    matchers: [{ leisure: "park" }],
    drops: [
      { item: "Branch" },
      { item: "Bark" },
      { item: "Leaf" },
      { item: "Used Coffee Cup" },
      { item: "Speaker" },
      { item: "Picnic Blanket" },
      { item: "Sandwich" },
      { item: "Ball" },
      { item: "Apple" },
      { item: "Hat" },
      { item: "Water Bottle" },
    ],
  },
  {
    matchers: [{ leisure: "playground" }],
    drops: [
      { item: "Toy Car" },
      { item: "Action Figure" },
      { item: "Doll" },
      { item: "Stuffed Animal" },
    ],
  },
  {
    matchers: [{ landuse: "construction" }],
    drops: [
      { item: "Hard hat" },
      { item: "Brick" },
      { item: "Wrench" },
      { item: "Plank" },
      { item: "Spade" },
      { item: "Safety Goggles" },
      { item: "Hi-vis" },
      { item: "Coffee Cup" },
      { item: "Clipboard" },
      { item: "Paper" },
      { item: "Empty Coffee Cup" },
      { item: "Wrapper" },
      { item: "Rusty Screw" },
      { item: "Rusty Nail" },
      { item: "Rusty Nut" },
      { item: "Rusty Bolt" },
      { item: "Keycard" },
    ],
  },
  {
    matchers: [{ tourism: "gallery" }],
    drops: [
      { item: "Painting" },
      { item: "Coin" },
      { item: "Paper" },
      { item: "Paintbrush" },
      { item: "Photograph" },
      { item: "Coffee cup" },
    ],
  },
  {
    matchers: [{ crossing: "traffic_signals" }, { highway: "traffic_signals" }],
    drops: [
      { item: "Plastic Shard" },
      { item: "Ripped Sticker" },
      { item: "Scrap of Paper" },
      { item: "Used Chewing Gum" },
    ],
  },
  {
    matchers: [{ amenity: "bbq" }],
    drops: [
      { item: "Paper Plate" },
      { item: "Plastic Fork" },
      { item: "Plastic Knife" },
      { item: "Used Napkin" },
      { item: "Empty Bottle" },
      { item: "Empty Can" },
      { item: "Plastic Bag" },
      { item: "Wrapper" },
      { item: "Used Chewing Gum" },
    ],
  },
  {
    matchers: [{ amenity: "place_of_worship" }],
    drops: [{ item: "Candle" }, { item: "Coin" }],
  },
  {
    matchers: [{ amenity: "place_of_worship", religion: "christian" }],
    drops: [{ item: "Bible" }, { item: "Cross" }],
  },
  {
    matchers: [
      {
        amenity: "place_of_worship",
        religion: "christian",
        denomination: "catholic",
      },
    ],
    drops: [
      { item: "Rosary" },
      { item: "Holy Water" },
      { item: "Prayer Beads" },
    ],
  },
  {
    matchers: [{ building: "public" }],
    drops: [
      { item: "Paper" },
      { item: "Stapler" },
      { item: "Pen" },
      { item: "Mouse" },
      { item: "Paperclip" },
      { item: "Calculator" },
    ],
  },
  // amenity: post_box
  {
    matchers: [{ amenity: "post_box" }],
    drops: [
      { item: "Letter" },
      { item: "Envelope" },
      { item: "Stamp" },
      { item: "Paper" },
    ],
  },
  // pharmacy
  {
    matchers: [{ amenity: "pharmacy" }],
    drops: [
      { item: "Prescription" },
      { item: "Pill" },
      { item: "Cough Syrup" },
      { item: "Bandage" },
      { item: "Plaster" },
      { item: "Cotton Swab" },
      { item: "Thermometer" },
      { item: "Syringe" },
      { item: "Needle" },
      { item: "Pill Bottle" },
      { item: "Pill Box" },
      { item: "Pill Cutter" },
      { item: "Pill Crusher" },
      { item: "Stick of Gum" },
      { item: "Toothpaste" },
      { item: "Toothbrush" },
      { item: "Dental Floss" },
      { item: "Mouthwash" },
      { item: "Hand Sanitizer" },
      { item: "Soap" },
      { item: "Shampoo" },
      { item: "Conditioner" },
      { item: "Toilet Paper" },
      { item: "Tissue" },
      { item: "Tampon" },
      { item: "Pad" },
      { item: "Condom" },
      { item: "Pregnancy Test" },
      { item: "Diaper" },
      { item: "Baby Wipe" },
      { item: "Baby Powder" },
      { item: "Baby Oil" },
      { item: "Baby Lotion" },
      { item: "Baby Shampoo" },
      { item: "Baby Soap" },
      { item: "Baby Food" },
      { item: "Baby Bottle" },
      { item: "Baby Bib" },
      { item: "Baby Spoon" },
    ],
  },
  // atm
  {
    matchers: [{ amenity: "atm" }],
    drops: [
      { item: "Credit Card" },
      { item: "Receipt" },
      { item: "Cash" },
      { item: "Coin" },
    ],
  },
  // disused
  {
    matchers: [{ amenity: "disused" }],
    drops: [
      { item: "Dust" },
      { item: "Cobweb" },
      { item: "Rusty Hinge" },
      { item: "Rusty Nut" },
      { item: "Rusty Bolt" },
      { item: "Padlock" },
      { item: "Chain" },
      { item: "Old Photograph" },
    ],
  },
  // supermarket
  {
    matchers: [{ shop: "supermarket" }],
    drops: [
      { item: "Shopping List" },
      { item: "Trolley" },
      { item: "Basket" },
      { item: "Receipt" },
      { item: "Credit Card" },
      { item: "Cash" },
      { item: "Coin" },
      { item: "Plastic Bag" },
      { item: "Wrapper" },
      { item: "Apple" },
      { item: "Bread" },
      { item: "Water Bottle" },
      { item: "Milk" },
      { item: "Can of Drink" },
      { item: "Packet of Chips" },
      { item: "Chocolate Bar" },
      { item: "Energy Drink" },
      { item: "Toilet Paper" },
      { item: "Soap" },
      { item: "Shampoo" },
      { item: "Conditioner" },
      { item: "Toothpaste" },
      { item: "Toothbrush" },
      { item: "Dental Floss" },
      { item: "Mouthwash" },
      { item: "Hand Sanitizer" },
      { item: "Baby Food" },
      { item: "Baby Bottle" },
      { item: "Baby Spoon" },
    ],
  },
  // bus stop
  {
    matchers: [{ highway: "bus_stop" }, { amenity: "shelter" }],
    drops: [
      { item: "Bus Ticket" },
      { item: "Timetable" },
      { item: "Coin" },
      { item: "Paper" },
      { item: "Empty Coffee Cup" },
      { item: "Wrapper" },
      { item: "Used Chewing Gum" },
    ],
  },
  // bakery
  {
    matchers: [{ shop: "bakery" }],
    drops: [
      { item: "Bread" },
      { item: "Pastry" },
      { item: "Brownie" },
      { item: "Toast" },
      { item: "Coffee" },
      { item: "Coffee Cup" },
      { item: "Menu" },
    ],
  },
  // shop: bicycle
  {
    matchers: [{ shop: "bicycle" }],
    drops: [
      { item: "Bike Lock" },
      { item: "Helmet" },
      { item: "Pump" },
      { item: "Tube" },
      { item: "Tyre" },
      { item: "Spoke" },
      { item: "Chain" },
      { item: "Pedal" },
      { item: "Saddle" },
      { item: "Handlebar" },
      { item: "Bell" },
      { item: "Light" },
      { item: "Reflector" },
      { item: "Water Bottle" },
      { item: "Energy Drink" },
    ],
  },
  // amenity: townhall
  {
    matchers: [{ amenity: "townhall" }],
    drops: [
      { item: "Paper" },
      { item: "Stapler" },
      { item: "Pen" },
      { item: "Mouse" },
      { item: "Paperclip" },
      { item: "Calculator" },
    ],
  },
  // post office
  {
    matchers: [{ amenity: "post_office" }],
    drops: [
      { item: "Letter" },
      { item: "Envelope" },
      { item: "Stamp" },
      { item: "Paper" },
      { item: "Pen" },
      { item: "Parcel" },
      { item: "Empty Box" },
      { item: "Coin" },
      { item: "Postcard" },
    ],
  },
  // leisure: pitch
  {
    matchers: [{ leisure: "pitch" }],
    drops: [{ item: "Whistle" }, { item: "Water Bottle" }],
  },
  // sport: basketball
  {
    matchers: [{ sport: "basketball" }],
    drops: [{ item: "Basketball" }],
  },

  // bar
  {
    matchers: [{ amenity: "bar" }],
    drops: [
      { item: "Beer" },
      { item: "Beer Glass" },
      { item: "Cutlery" },
      { item: "Chair" },
      { item: "Ice" },
      { item: "Coaster" },
      { item: "Cocktail Shaker" },
      { item: "Cocktail Glass" },
      { item: "Wine Glass" },
      { item: "Shot Glass" },
      { item: "Lemon Slice" },
      { item: "Credit Card" },
    ],
  },
  // shop: mobile_phone
  {
    matchers: [{ shop: "mobile_phone" }],
    drops: [
      { item: "Phone" },
      { item: "Charger" },
      { item: "Cable" },
      { item: "Headphones" },
      { item: "Phone Case" },
      { item: "Screen Protector" },
      { item: "Sim Card" },
      { item: "SD Card" },
    ],
  },

  // newsagent
  {
    matchers: [{ shop: "newsagent" }],
    drops: [
      { item: "Newspaper" },
      { item: "Magazine" },
      { item: "Bookmark" },
      { item: "Pen" },
      { item: "Paper" },
      { item: "Paperclip" },
      { item: "Calculator" },
      { item: "Coffee Cup" },
      { item: "Empty Coffee Cup" },
      { item: "Wrapper" },
      { item: "Used Chewing Gum" },
      { item: "Greeting Card" },
      { item: "Lottery Ticket" },
      { item: "Coin" },
    ],
  },

  // laundry
  {
    matchers: [{ shop: "laundry" }, { shop: "dry_cleaning" }],
    drops: [
      { item: "Clothes" },
      { item: "Sock" },
      { item: "Underwear" },
      { item: "Towel" },
      { item: "Sheet" },
      { item: "Pillowcase" },
      { item: "Blanket" },
      { item: "Detergent" },
      { item: "Fabric Softener" },
      { item: "Bleach" },
      { item: "Coin" },
      { item: "Receipt" },
    ],
  },

  // tailor
  {
    matchers: [{ shop: "tailor" }],
    drops: [
      { item: "Needle" },
      { item: "Thread" },
      { item: "Scissors" },
      { item: "Tape Measure" },
      { item: "Pin" },
      { item: "Fabric" },
      { item: "Button" },
      { item: "Zip" },
      { item: "Seam Ripper" },
      { item: "Iron" },
      { item: "Ironing Board" },
      { item: "Sewing Machine" },
      { item: "Pattern" },
      { item: "Mannequin" },
      { item: "Coin" },
      { item: "Receipt" },
    ],
  },

  // variety store
  {
    matchers: [{ shop: "variety_store" }],
    drops: [
      { item: "Paper" },
      { item: "Pen" },
      { item: "Paperclip" },
      { item: "Calculator" },
      { item: "Coin" },
      { item: "Plastic Bag" },
      { item: "Toothbrush" },
      { item: "Tongs" },
      { item: "Toy Car" },
      { item: "Action Figure" },
      { item: "Doll" },
      { item: "Stuffed Animal" },
      { item: "Bike Lock" },
      { item: "Bell" },
      { item: "Light" },
      { item: "Water Bottle" },
      { item: "Energy Drink" },
    ],
  },

  // video shop
  {
    matchers: [{ shop: "video" }],
    drops: [
      { item: "DVD" },
      { item: "Popcorn" },
      { item: "Candy" },
      { item: "Soda" },
    ],
  },

  // cuisine: vietnamese
  {
    matchers: [{ cuisine: "vietnamese" }],
    drops: [
      { item: "Chopsticks" },
      { item: "Sriracha" },
      { item: "Lemon Slice" },
      { item: "Bean Sprouts" },
      { item: "Soup Spoon" },
      { item: "Bread" },
      { item: "Holy Basil" },
      { item: "Maneki-Neko" },
      { item: "Rice" },
      { item: "Wrapper" },
    ],
  },

  // beauty shop
  {
    matchers: [{ shop: "beauty" }],
    drops: [
      { item: "Makeup" },
      { item: "Lipstick" },
      { item: "Mascara" },
      { item: "Eyeliner" },
      { item: "Foundation" },
      { item: "Blush" },
      { item: "Eyeshadow" },
      { item: "Nail Polish" },
      { item: "Nail File" },
      { item: "Nail Clipper" },
      { item: "Fingernail" },
    ],
  },

  // doctors
  {
    matchers: [{ amenity: "doctors" }],
    drops: [
      { item: "Prescription" },
      { item: "Pill" },
      { item: "Bandage" },
      { item: "Plaster" },
      { item: "Cotton Swab" },
      { item: "Thermometer" },
      { item: "Syringe" },
      { item: "Pill Bottle" },
      { item: "Stethoscope" },
      { item: "Glove" },
      { item: "Mask" },
      { item: "Mouse" },
      { item: "Paper" },
      { item: "Pen" },
    ],
  },

  // hairdresser
  {
    matchers: [{ shop: "hairdresser" }],
    drops: [
      { item: "Hair" },
      { item: "Hair Tie" },
      { item: "Hair Clip" },
      { item: "Hairpin" },
      { item: "Hairbrush" },
      { item: "Comb" },
      { item: "Scissors" },
      { item: "Cape" },
      { item: "Mirror" },
      { item: "Hair Dye" },
      { item: "Shampoo" },
      { item: "Conditioner" },
      { item: "Hair Gel" },
      { item: "Hair Spray" },
      { item: "Hair Dryer" },
      { item: "Straightener" },
      { item: "Curler" },
      { item: "Headband" },
    ],
  },

  // butcher
  {
    matchers: [{ shop: "butcher" }],
    drops: [
      { item: "Sausage" },
      { item: "Bacon" },
      { item: "Steak" },
      { item: "Lamb Chop" },
      { item: "Chicken Wing" },
      { item: "Pork Belly" },
      { item: "Beef Rib" },
      { item: "Meat Cleaver" },
      { item: "Apron" },
      { item: "Gloves" },
      { item: "Knife" },
      { item: "Chopping Board" },
      { item: "Paper" },
      { item: "Receipt" },
      { item: "Coin" },
    ],
  },

  // shop: alcohol
  {
    matchers: [{ shop: "alcohol" }],
    drops: [
      { item: "Beer" },
      { item: "Wine" },
      { item: "Spirits" },
      { item: "Cocktail" },
      { item: "Shot" },
      { item: "Glass" },
      { item: "Bottle" },
      { item: "Corkscrew" },
      { item: "Wine Glass" },
      { item: "Shot Glass" },
      { item: "Cocktail Glass" },
      { item: "Credit Card" },
      { item: "Receipt" },
      { item: "Coin" },
    ],
  },
  // delicatessen
  {
    matchers: [{ industry: "delicatessan" }],
    drops: [
      { item: "Cheese" },
      { item: "Salami" },
      { item: "Olives" },
      { item: "Pickles" },
      { item: "Pate" },
      { item: "Bread" },
      { item: "Knife" },
      { item: "Chopping Board" },
      { item: "Paper" },
      { item: "Receipt" },
      { item: "Coin" },
    ],
  },

  // telephone
  {
    matchers: [{ amenity: "telephone" }],
    drops: [
      { item: "Coin" },
      { item: "Receipt" },
      { item: "Paper" },
      { item: "Empty Coffee Cup" },
      { item: "Wrapper" },
      { item: "Used Chewing Gum" },
      { item: "Wire" },
    ],
  },

  // tree
  {
    matchers: [{ natural: "tree" }],
    drops: [
      { item: "Branch" },
      { item: "Bark" },
      { item: "Leaf" },
      { item: "Twig" },
      { item: "Feather" },
    ],
  },

  // temporary - suppress no drops
  {
    matchers: [
      { crossing: "no" },
      { place: "suburb" },
      { barrier: "kerb" },
      { railway: "switch" },
      { railway: "buffer_stop" },
      { highway: "elevator" },
      { highway: "crossing" },
      { barrier: "lift_gate" },
      {
        railway: "railway_crossing",
      },
      { railway: "signal" },
      { traffic_calming: "table" },
      { barrier: "bollard" },
      { traffic_calming: "hump" },
      { highway: "turning_circle" },
      { barrier: "kissing_gate" },
      { place: "locality" },
      { bicycle: "destination" },
      { entrance: "yes" },
      { highway: "give_way" },
      { entrance: "main" },
      { traffic_sign: "maxspeed" },
      /*
        { railway: "crossing" },
        { railway: "buffer_stop" },
        { railway: "level_crossing" },
        { railway: "signal" },
        { railway: "station" },
        { railway: "tram_stop" },
        { railway: "yard" },
        { railway: "halt" },
        { railway: "platform" },
        { railway: "spur" },
        { railway: "subway_entrance" },
        { railway: "subway_exit" },
         */
    ],
    drops: [],
  },
];

// each item has an emoji!

export const itemMap: { [key: string]: string } = {
  "Toilet Paper": "🧻",
  Soap: "🧼",
  "Used Syringe": "💉",
  Condom: "🍆",
  Razon: "🪒",
  Tampon: "🩸",
  Pad: "🩸",
  "Used Diaper": "🩹",
  "Drink Can": "🥤",
  "Packet of Chips": "🍟",
  "Chocolate Bar": "🍫",
  "Energy Drink": "🥤",
  Water: "💧",
  Beer: "🍺",
  "Beer Glass": "🍺",
  Cutlery: "🍴",
  Schnitzel: "🍖",
  "Hot chips": "🍟",
  "Billiard Ball": "🎱",
  Chair: "🪑",
  Ice: "🧊",
  Coaster: "🍻",
  Coffee: "☕",
  "Coffee Cup": "☕",
  Menu: "📖",
  Pastry: "🥐",
  Brownie: "🍫",
  Bacon: "🥓",
  "Fried Egg": "🍳",
  Toast: "🍞",
  "Disposable Cutlery": "🍴",
  "Paper Bag": "🛍️",
  Burger: "🍔",
  Ketchup: "🍅",
  Fries: "🍟",
  Kebab: "🥙",
  "Garlic Sauce": "🧄",
  "BBQ Sauce": "🍖",
  "Sweet Chilli Sauce": "🌶️",
  "Soy Sauce": "🥢",
  Chopsticks: "🥢",
  Nori: "🍣",
  Sashimi: "🍣",
  Udon: "🍜",
  Sushi: "🍣",
  "Tempura Prawn": "🍤",
  Karaage: "🍗",
  Helmet: "⛑️",
  Keys: "🔑",
  Painting: "🖼️",
  Sock: "🧦",
  "Clothes Hanger": "🪞",
  Fork: "🍴",
  Spoon: "🥄",
  Knife: "🔪",
  Glass: "🥛",
  Mug: "🍺",
  Book: "📚",
  Lampshade: "🪔",
  Underwear: "🩲",
  "Paper Towel": "🧻",
  Candle: "🕯️",
  Headphones: "🎧",
  Coin: "💰",
  Plate: "🍽️",
  Egg: "🥚",
  Mouse: "🖱️",
  Cable: "🔌",
  Hat: "🎩",
  Scarf: "🧣",
  Toothbrush: "🪥",
  Brick: "🧱",
  "Plant Pot": "🪴",
  "Key Card": "🔑",
  Paper: "📄",
  Stapler: "📎",
  Pen: "🖊️",
  Paperclip: "🖇️",
  Calculator: "🧮",
  "Empty Water Bottle": "🧴",
  "Empty Can": "🥫",
  "Plastic Bag": "🛍️",
  Wrapper: "🍬",
  Wipe: "🧻",
  "Used Wipe": "🧻",
  "Water Bottle": "💧",
  "Protein Shake": "🥤",
  Towel: "🧻",
  Dumbbell: "🏋️",
  Barbell: "🏋️",
  Kettlebell: "🏋️",
  Headband: "🧢",
  Phone: "📱",
  Watch: "⌚",
  Spraypaint: "🎨",
  Chalk: "🎨",
  Wire: "🔌",
  "Rusty Hinge": "🔩",
  "Rusty Nut": "🔩",
  "Rusty Bolt": "🔩",
  Padlock: "🔒",
  Chain: "🔗",
  "Rubber Circle": "⚪",
  LED: "💡",
  Pebble: "🪨",
  "Used Coffee Cup": "☕",
  "Train Ticket": "🎫",
  Branch: "🌿",
  Bark: "🌳",
  Leaf: "🍃",
};

/*
const tileMap: { matchers: { [key: string]: string }[]; color: string }[] = [
  {
    matchers: [{ landuse: "railway" }],
    color: "blue",
  },
];

*/
