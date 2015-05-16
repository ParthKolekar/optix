/* gameArray.js 
* Parth Kolekar
* Anurag Ghosh
* CopyLeft - 2014
* Game Array functionality - version 1.0
*/

var Colors = {
    None: "#FFFFFF",
    Ice: "#D0D0D0",
    Sand: "#D0A060",
    Rand: "#FFCC99",
    Down: "#3399FF",
    Up: "#33CCFF",
    Left: "#3399CC",
    Right: "#33CCCC",
    Mirror: "#E39D16",
};

var Types = {
    Pencil: 1,
    Spray: 2,
    Scale: 3,
};

gameArray = {
    Nothing: 0,
    Blue: 1,
    BlueBit: 0,
    Red: 2,
    RedBit: 1,
    IceTerrain: 4,
    IceTerrainBit: 2,
    SandTerrain: 8,
    SandTerrainBit: 3,
    RandTerrain: 16,
    RandTerrainBit: 4,
    PrismDown: 32,
    PrismDownBit: 5,
    Mirror: 64,
    MirrorBit: 6,
    PortalOrange: 128,
    PortalOrangeBit: 7,
    PortalOrangeSink: 256,
    PortalOrangeSinkBit: 8,
    PortalBlue: 512,
    PortalBlueBit: 9,
    PortalBlueSink: 1024,
    PortalBlueSinkBit: 10,
    WinningTerrain: 2048,
    WinningTerrainBit: 11,
    PrismUp: 4096,
    PrismUpBit: 12,
    PrismLeft: 8192,
    PrismLeftBit: 13,
    PrismRight: 16384,
    PrismRightBit: 14
};