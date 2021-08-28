class Battery {
    constructor(batteryName, capacity, voltage, maximumDischargeCurrent, cadenceVoltage){
        this.batteryName = batteryName;
        this.capacity = capacity;
        this.voltage = voltage;
        this.maximumDischargeCurrent = maximumDischargeCurrent;
        this.cadenceVoltage = cadenceVoltage;
    }
    electricCapacity(){
        return this.voltage * this.capacity;
    }
    finallyCadenceVoltage(){
        return this.maximumDischargeCurrent * this.cadenceVoltage;
    }
    continueBattery(cameraPower){
        return (Math.floor((this.electricCapacity() / cameraPower) * 10)) / 10;
    }
}
class Camera {
    constructor(maker, productName, powerConsumption){
        this.maker = maker;
        this.productName = productName;
        this.powerConsumption = powerConsumption;
    }
}
class Controller {
    constructor(batteries, cameras){
        this.batteries = this.sortBatteries(batteries);
        this.cameras = cameras;
    }
    sortBatteries(batteries){
        batteries.sort(function(a,b){
            if (a.batteryName > b.batteryName ) return 1;
            if (b.batteryName > a.batteryName ) return -1;
            return 0;
        });

        return batteries;
    }
    showBrand(){
        const brands = document.getElementById("brand");
        let option = "";
        let hashmap = new Map();

        for(let i = 0; i < this.cameras.length; i++){
            if(hashmap.has(cameras[i].maker) === true) continue;

            hashmap.set(cameras[i].maker);
            option = document.createElement("option");
            option.text = cameras[i].maker;
            option.value = cameras[i].maker;
            brands.appendChild(option);
        }
    }
    showModel(cameraBrand){
        const models = document.getElementById("model");
        let option = "";

        for(let i = 0; i < this.cameras.length; i++){
            if(cameras[i].maker !== cameraBrand) continue;

            option = document.createElement("option");
            option.text = cameras[i].productName;
            option.value = cameras[i].productName;
            models.appendChild(option);
        }
    }
    deleteModel(){
        const DELETE_ITEM = 1;
        let models = document.getElementById("model");
        let modelsLength = models.length;

        // 子要素が流動的に変化するため、配列の1番目を削除
        for(let i = 0; i < modelsLength; i++){
            models.remove(DELETE_ITEM);
        }
    }
    addInitList(message){
        let ulItem = document.getElementById("battery");
        let liItem = document.createElement("li");
        liItem.classList.add("d-flex", "list-group-item");

        let productLi = document.createElement("div");
        productLi.classList.add("col-12", "text-center");
        productLi.innerHTML = message;

        liItem.append(productLi);
        ulItem.append(liItem);
    }
    showBatteries(maker, model, accePower){
        let checkBattery = false;
        this.deleteBatteryList();

        let cameraPower = parseInt(accePower);
        this.cameras.map(function( camera ) {
            if(camera.maker === maker && camera.productName === model) {
                cameraPower += camera.powerConsumption;
            }
        })

        for(let i = 0; i < this.batteries.length; i++){
            if(this.batteries[i].finallyCadenceVoltage() > cameraPower){
                this.createBatteryList(this.batteries[i].batteryName, this.batteries[i].continueBattery(cameraPower));
                checkBattery = true;
            }
        }

        // 対象のバッテリーなし
        if(checkBattery === false) {
            this.deleteBatteryList();
            this.addInitList("There was no corresponding battery");
        }
    }
    createBatteryList(productName, continueHour){
        let ulItem = document.getElementById("battery");
        let liParent = document.createElement("li");
        liParent.classList.add("d-flex", "list-group-item");

        let liProduct = document.createElement("div");
        liProduct.classList.add("col-6");
        liProduct.innerHTML = productName;

        let liHour = document.createElement("div");
        liHour.classList.add("col-6", "text-right");
        liHour.innerHTML = "Estimated " + continueHour + " hours on selected setup";

        liParent.append(liProduct);
        liParent.append(liHour);

        ulItem.append(liParent);
    }
    deleteBatteryList(){
        document.getElementById("battery").innerText = "";
    }
}

const batteries = [
    // batteryName, capacity, voltage, maximumDischargeCurrent, cadenceVoltage
    new Battery("ATM-J10", 6, 7, 2, 9),
    new Battery("RMD-SR4", 10.2, 10.4, 2, 5),
    new Battery("FCB-MSN10", 20.2, 5.8, 4.9, 3),
    new Battery("ARS-MS8", 16, 14.4, 3.2, 10),
    new Battery("PSG-MJ23", 4.9, 2.8, 8.9, 11),
    new Battery("PSG-B99", 10.7, 1.8, 4.1, 11),
    new Battery("CHL-D09", 6.3, 14, 6.3, 12),
    new Battery("MCU-CR7", 9.3, 14.3, 4, 10),
    new Battery("MCC-D008", 18, 6.4, 11, 8),
    new Battery("LVC-J014", 14.2, 11.8, 10, 2),
    new Battery("RMD-CR7", 22.3, 7.4, 14, 7),
];
const cameras = [
    // maker, productName, powerConsumption
    new Camera("Canon", "ABC 3000M", 35.5),
    new Camera("CAKON", "UIK 70C", 80.3),
    new Camera("Go PRO", "UIK 10C", 10.3),
    new Camera("Go PRO", "UIK 301C", 25.3),
    new Camera("VANY", "CEV 1100P", 20),
    new Camera("Canon", "UIK 110C", 62.3),
    new Camera("Go MN", "UIK 230C", 26.3),
];

const target = document.getElementById("target");
target.innerHTML += 
    `
        <div class="bg-light-gray p-3"></div>
        <div class="bg-blue">
            <h3 class="text-white text-center">Battery Finder Program</h3>
        </div>
        <div class="container-fluid">
            <div class="col-12">
                <label for="brand">step1: Select your brand</label>
                <select id="brand" name="brand">
                    <option value="0">Select Brand</option>
                </select>
            </div>
            <div class="col-12">
                <label for="model">step2: Select your Model</label>
                <select id="model" name="model">
                    <option value="0">Select Model</option>
                </select>
            </div>
            <div class="col-12">
                <label for="power">step3: Input Accessory Power Consumption</label>
                <input id="power" type="number">W
            </div>
            <div class="col-12 pb-5">
                <label>step4: Choose Your Battery</label>
                <ul id="battery" class="list-group">
                    <li class="d-flex list-group-item">
                        <div class="col-12 text-center">
                            There was no corresponding battery
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="bg-light-gray p-3"></div>
    `
;

let changeBrand = document.getElementById("brand");
let changeModel = document.getElementById("model");
let inputPower = document.getElementById("power");

const controller = new Controller(batteries, cameras);
controller.showBrand();

changeBrand.addEventListener("change", function(){
    controller.deleteModel();
    controller.deleteBatteryList();
    controller.addInitList("There was no corresponding battery");
    controller.showModel(changeBrand.value);
});

changeModel.addEventListener("change", function(){
    if(changeModel.value === "0"){
        controller.deleteBatteryList();
        controller.addInitList("There was no corresponding battery");
    }else{
        inputPower.value = 0;
        controller.showBatteries(changeBrand.value, changeModel.value, 0);
    }
});

inputPower.addEventListener("input", function(){
    if(isNaN(inputPower.value)){
        controller.deleteBatteryList();
        controller.addInitList(`please input "number"!`);
    }else if(0 > inputPower.value || inputPower.value > 100){
        controller.deleteBatteryList();
        controller.addInitList(`please input power range "0~100W"`);
    }else if(changeBrand.value !== "0" && changeModel.value !== "0"){
        controller.showBatteries(changeBrand.value, changeModel.value, inputPower.value);
    }else{
        controller.deleteBatteryList();
        controller.addInitList(`please select "Brand" and "Model"`);
    }
});