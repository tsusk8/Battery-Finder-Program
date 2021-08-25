// あなたは電池を量産するエンジニアリングチームに所属しており、
// 顧客に電池を推奨するプログラムを開発する仕事を任されています。
// 今、カメラ用電池のデータセットとカメラのデータセットが与えられています。
// 電池のデータセットには、電池名、容量（Ah）、電圧、最大放電電流（A）、終止電圧が含まれており、
class Battery {
    // 　　　　　　　電池名、　　　容量（A/h）、電圧、　　　最大放電電流（A）、　　　　　終止電圧
    constructor(batteryName, capacity, voltage, maximumDischargeCurrent, cadenceVoltage){
        this.batteryName = batteryName;
        this.capacity = capacity;
        this.voltage = voltage;
        this.maximumDischargeCurrent = maximumDischargeCurrent;
        this.cadenceVoltage = cadenceVoltage;
    }
    // 消費電力
    calElectricPower(){
        return this.voltage * this.maximumDischargeCurrent;
    }
    // 電力容量
    calElectricCapacity(){
        // テレビの電源電圧が 120V で、電流が 1.2A の場合、消費電力は P = I * V を用いて、
        // P = 120 * 1.2 = 144W となります。同様に、電圧が 14.4V で、
        // 満充電時電池容量が 6.6Ah（A / hr）の電池は、14.4V × 6.6Ah = 95Wh（W / hr）の電力容量を持ちます。
        return this.voltage * this.capacity;
    }
    // 終止電圧時
    finallyCadenceVoltage(){
        // チームは充電池のショートや破裂しないように安全対策を構築する必要があります。
        // 電池は使用していくうちに電圧が低下し、そのまま使い続けると、電極が溶けたり破裂したりする原因となります。
        // 安全に使用できる最低電圧を終止電圧と言います。
        // 終止電圧時に電池が供給できる電力は、終止電圧 × 最大放電電流 で計算でき、
        // カメラの消費電力を上回るようにしなければなりません。
        return this.maximumDischargeCurrent * this.cadenceVoltage;
    }
    // 持続時間
    continueBattery(acceValue){
        return (Math.floor(this.calElectricCapacity() / (this.calElectricPower() + acceValue) * 10)) / 10;
    }
}
// カメラのデータセットには、メーカー、製品名、消費電力（Wh ワット時間）が含まれています。
class Camera {
    constructor(maker, productName, powerConsumption){
        this.maker = maker;
        this.productName = productName;
        this.powerConsumption = powerConsumption;
    }
}
class Controller {
    // Battery array
    constructor(batteries, cameras){
        this.batteries = batteries;
        this.cameras = cameras;
    }
    showBrand(){
        const brands = document.getElementById("brand");
        let option = "";
        let hashmap = new Map();

        this.cameras.map(function( camera ) {
            if(hashmap.has(camera.maker) === true) return;
            hashmap.set(camera.maker);

            option = document.createElement("option");
            option.text = camera.maker;
            option.value = camera.maker;
            brands.appendChild(option);
        })
    }
    showModel(cameraBrand){
        const models = document.getElementById("model");
        let option = "";

        this.cameras.map(function( camera ) {
            if(camera.maker !== cameraBrand) return;

            option = document.createElement("option");
            option.text = camera.productName;
            option.value = camera.productName;
            models.appendChild(option);
        })
    }
    deleteModel(){
        const deleteItem = 1;
        let models = document.getElementById("model");
        let modelsLength = models.length;

        // 子要素が流動的に変化するため、配列の1番目を削除
        for(let i = 0; i < modelsLength; i++){
            models.remove(deleteItem);
        }
    }
    showInitBattery(){
        let ulItem = document.getElementById("battery");
        let liItem = document.createElement("li");
        liItem.classList.add("d-flex", "list-group-item");

        let productLi = document.createElement("div");
        productLi.classList.add("col-12", "text-center");
        productLi.innerHTML = "There was no corresponding battery";

        liItem.append(productLi);
        ulItem.append(liItem);
    }
    showBatteries(maker, model, inputedPower){
        let isCheck = false;
        this.deleteBatteryList();

        let cameraPower = inputedPower;
        console.log(cameraPower);
        this.cameras.map(function( camera ) {
            if(camera.maker === maker && camera.productName === model) {
                console.log("good");
                cameraPower += camera.powerConsumption;
                console.log(cameraPower);
            }
            // console.log(camera.maker);
            // console.log(maker);
            // console.log(camera.productName);
            // console.log(model);
            // console.log(camera.powerConsumption);
            // console.log(inputPower);
            // console.log("-------------");
        })
        
        // console.log(inputedPower);
        // console.log(cameraPower);

        for(let i = 0; i < this.batteries.length; i++){
            if(this.batteries[i].finallyCadenceVoltage() > cameraPower){
                this.createBatteryList(this.batteries[i].batteryName, this.batteries[i].continueBattery(cameraPower));
                isCheck = true;
            }
        }

        // 該当なし
        if(isCheck === false) {
            this.showInitBattery();
        }
    }
    createBatteryList(productName, continueHour){
        let ulItem = document.getElementById("battery");
        let liItem = document.createElement("li");
        liItem.classList.add("d-flex", "list-group-item");

        let productLi = document.createElement("div");
        productLi.classList.add("col-6");
        productLi.innerHTML = productName;

        let hourLi = document.createElement("div");
        hourLi.classList.add("col-6", "text-right");
        hourLi.innerHTML = "Estimated " + continueHour + " hours on selected setup";

        liItem.append(productLi);
        liItem.append(hourLi);

        ulItem.append(liItem);
    }
    deleteBatteryList(){
        let batteries = document.getElementById("battery");
        batteries.innerHTML = "";
    }
}
// 仮にその電池を消費電力が 50W のカメラに使用した場合、95 / 50 ＝ 1.9 時間（114分）持続可能であることを意味します。

// 例えば、電池の最大放電電流が 6.3A で 12V が終止電圧の場合、
// 終止電圧時の最大放電電力は 6.3A × 12V = 76W となり 76W 以上消費するカメラには使用できません。
// メーカーと製品名を選択し、その後アクセサリー（USB やライト等）用に、
// 0-100W の範囲で消費電力が入力可能なアプリケーションを作成してください。
// 総消費電力に基づいて、カメラセットと互換性のあるすべての電池を表示し、
// さらに満充電時にどれほど電池が持続するか表示してください。

// カメラとアクセサリーの消費電力が終止電圧時の電池の最大消費電力を超える場合は、
// その電池には対応してないことになります。電池のリストは常にアルファベット順に表示し、
// 互換性のない電池は表示しないようにしてください。ユーザーがカメラの選択、
// あるいはアクセサリーの消費電力を更新した場合は、常にリストを更新または再表示できるようにしてください。 
// ここから書いてください。

const batteries = [
    new Battery("IOP-E140", 9.9, 14.4, 14, 10),
    new Battery("IOP-E188", 13.2, 14.4, 14, 11),
    new Battery("LP-E17", 2.3, 14.4, 3.2, 10),
    new Battery("RYN-C65", 4.9, 14.8, 4.9, 11),
    new Battery("RYN-C85", 6.3, 14.4, 6.3, 12),
    new Battery("RYN-C140", 9.8, 14.8, 10, 12),
    new Battery("RYN-C290", 19.8, 14.4, 14, 2),
];
const cameras = [
    new Camera("Canon", "ABC 3000M", 35.5),
    new Camera("Go MN", "UIK 110C", 62.3),
    new Camera("VANY", "CEV 1100P", 20),
    new Camera("Go MN", "UIK 230C", 26.3),
];

let changeBrand = document.getElementById("brand");
let changeModel = document.getElementById("model");
let inputPower = document.getElementById("power");

const controller = new Controller(batteries, cameras);
controller.showBrand();

changeBrand.addEventListener("change", function(){
    controller.deleteModel();
    controller.showModel(changeBrand.value);
});

changeModel.addEventListener("change", function(){
    inputPower.value = 0;
    controller.showBatteries(changeBrand.value, changeModel.value, 0);
});

inputPower.addEventListener("input", function(){
    if(isNaN(inputPower.value)){
        console.log("please input 'number'!");
    }else if(0 >= inputPower.value || inputPower.value > 100){
        console.log("please input power range 0~100W");
    }else if(changeBrand.value !== "0" && changeModel.value !== "0"){
        controller.showBatteries(changeBrand.value, changeModel.value, inputPower.value);
    }else{
        console.log(`please select "Brand" and "Model"`);
    }
});