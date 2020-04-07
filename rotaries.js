class Rotaries 
{
    constructor(cursorTrack) 
    {
        this.cursorTrack = cursorTrack;
    
        this.modes =
        {
            MACRO: 0,
            COMMON: 1
        };
    
        this.mode = this.modes.MACRO;

        this.setDeviceIndication(true, false);
    
        this.ccToParam = [];
        this.ccToParam[71] = 0;
        this.ccToParam[74] = 1;
        this.ccToParam[84] = 2;
        this.ccToParam[7] = 3;
        this.ccToParam[91] = 4;
        this.ccToParam[93] = 5;
        this.ccToParam[5] = 6;
        this.ccToParam[10] = 7;
    }

    toggleMode() 
    {
        if(this.mode === this.modes.MACRO) 
        {
            this.mode = this.modes.COMMON;
            host.showPopupNotification("Rotaries: Common");
            this.setDeviceIndication(false, true);
        }
        else 
        {
            this.mode = this.modes.MACRO;
            host.showPopupNotification("Rotaries: Macros");
            this.setDeviceIndication(true, false);
        }
    }

    setDeviceIndication(macro, common) 
    {
        primaryDevice = this.cursorTrack.getPrimaryDevice();

        for(var i = 0; i < 8; i++) 
        {
            primaryDevice.getMacro(i).getAmount().setIndication(macro);
            primaryDevice.getCommonParameter(i).setIndication(common);
        }
    }

    isRotary(cc) 
    {
        return cc < this.ccToParam.length && this.ccToParam[cc] != undefined;
    }

    onMidi(status, data1, data2) 
    {
        primaryDevice = this.cursorTrack.getPrimaryDevice();
        var index = this.ccToParam[data1];

        if(this.mode === this.modes.MACRO) 
        {
            primaryDevice.getMacro(index).getAmount().set(data2, 128);
        }
        else 
        {
            primaryDevice.getCommonParameter(index).set(data2, 128);
        }
    }
}
