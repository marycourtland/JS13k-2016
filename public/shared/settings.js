var Settings = {};

// SERVER SIDE ==============================
Settings.tickTimeout = 5000; // ms
Settings.oxygenDrain = 0.05; // player will die in 20 ticks
Settings.glitchPerDeath = 1;


// CLIENT SIDE ==============================

// margins control how far the player goes the view starts scrolling 
Settings.marginR = 0.4; // percent of the view
Settings.marginL = 0.2;

// wireNear and wireFar control when player wires form and break
Settings.wireNear = 30; // pixels
Settings.wireFar = 600; // pixels, as the crow flies 
