var Settings = {};

// SERVER SIDE ==============================
Settings.tickTimeout = 1000; // ms
Settings.oxygenDrain = 0.005; // player will die in 20 ticks
Settings.glitchPerDeath = 1;
Settings.playerWireRadius = 50; // if the player on the other side is closer than that, make a wire


// CLIENT SIDE ==============================

// margins control how far the player goes the view starts scrolling 
Settings.marginR = 0.4; // percent of the view
Settings.marginL = 0.2;

Settings.velocity = 5;

// wireNear and wireFar control when player wires form and break
Settings.wireNear = 30; // pixels
Settings.wireFar = 600; // pixels, as the crow flies 
