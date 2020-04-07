loadAPI(10);

host.setShouldFailOnDeprecatedUse(true);

host.defineController("M-Audio", "Axiom 49", "0.1", "dc4d0364-cf7a-4cc5-a004-b4acfce010d4", "Eric Princen");

host.defineMidiPorts(1, 1)
host.addDeviceNameBasedDiscoveryPair(["USB Axiom 49 MIDI 1"], ["USB Axiom 49 MIDI 1"]);

const CC_RANGE_LO = 60;
const CC_RANGE_HI = 100;

const TRANS_RANGE_LO = 0x14;
const TRANS_RANGE_HI = 0x19;

const BUTTON = 
{
   LOOP: 0x14,
   REW: 0x15,
   FWD: 0x16,
   STOP: 0x17,
   PLAY: 0x18,
   REC: 0x19,
};

let noteInput = null;
let transport = null;
let userControls = null;

function init() 
{
   const input1 = host.getMidiInPort(0);
   input1.setMidiCallback(onMidi);

   noteInput = input1.createNoteInput("M-Audio"); // , "80????", "90????", "99????", "B001??", "B002??", "B00B??", "B040??", "C0????", "D0????", "E0????");
   noteInput.setShouldConsumeEvents(false);

   userControls = host.createUserControls(CC_RANGE_HI - CC_RANGE_LO + 1);

   for(let i = CC_RANGE_LO;i <= CC_RANGE_HI; i++)
   {
      userControls.getControl(i - CC_RANGE_LO).setLabel("CC" + 1);
   }

   transport = host.createTransport();
}

function flush() 
{
}

function exit() 
{
}

function onMidi(status, data1, data2)
{
   if(isChannelController(status))
   {
      if(data1 >= CC_RANGE_LO && data1 <= CC_RANGE_HI)
      {
         const index = data1 - CC_RANGE_LO;
         userControls.getControl(index).set(data2, 128);
      }
      else if(data1 >= TRANS_RANGE_LO && data1 <= TRANS_RANGE_HI)
      {
         switch(data1)
         {
            case BUTTON.PLAY:
               transport.play();
               break;
            case BUTTON.STOP:
               transport.stop();
               break;
            case BUTTON.REC:
               transport.record();
               break;
            case BUTTON.FWD:
               transport.fastForward();
               break;
            case BUTTON.REW:
               transport.rewind();
               break;
            case BUTTON.LOOP:
               transport.isArrangerLoopEnabled().toggle();
               break;
            default:
               host.errorln("Transport Command is not supported:" + data1);
         }
      }
      else
      {
         printMidi(status, data1, data2);
      }
   }
}
