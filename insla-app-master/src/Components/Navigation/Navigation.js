import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator, DrawerItems } from "react-navigation-drawer";
import Estimations from "../Estimations/Estimations";
import Jobs from "../Jobs/Jobs";
import Bodega from "../Bodega/Bodega";
import UpdateBHarvest from "../Bodega/UpdateBHarvest";
import UpdateBProduction from "../Bodega/UpdateBProduction";
import AddEstimations from "../Estimations/AddEstimations";
import ToolsCantidad from "../Tools/ToolsCantidad";
import TabTools from "../Tools/TabTools";
import UpdateToolsCant from "../Tools/UpdateToolsCant";
import Profile from "../Profile/Profile";
import { SafeAreaView, ScrollView, View, Image } from "react-native";
import { Button, Text } from "native-base";
import React, { Component } from "react";
import AddSuelo from "../Jobs/AddSuelo";
import SignOutButton from "../Login/SignOut";
import CardDetails from "../Estimations/CardDetails";
import UpdateEstimations from "../Estimations/UpdateEstimations";
import AddSowing from "../Jobs/AddSowing";
import addHarvest from "../Jobs/addHarvest";
import UpdateSowing from "../Jobs/UpdateSowing";
import UpdateSuelo from "../Jobs/UpdateSuelo";
import updateHarvest from "../Jobs/updateHarvest";
import updateWorkerSeed from "../Jobs/updateWorkerSeed";
import { firebase, fs } from "../Firebase/config";
import UserDetails from "../Profile/UserDetails";
import SoilHome from "../Jobs/SoilHome";
import AddWorker from "../Jobs/AddWorker";
import AddWorkerCosecha from "../Jobs/AddWorkerCosecha";
import AddChemical from "../Jobs/AddChemical";
import SoilReport from "../Jobs/soilReport";
import AddWorkerPlow from "../Jobs/AddWorkerPlow";
import PlowHome from "../Jobs/PlowHome";
import AddChapulin from "../Jobs/AddChapulin";
import NutrientsHome from "../Jobs/NutrientsHome";
import ShowWorkerPlow from "../Jobs/ShowWorkerPlow";
import AddWorkerNutrients from "../Jobs/AddWorkerNutrients";
import AddAlkalinization from "../Jobs/AddAlkalization";
import UpdateToolsAdmin from "../Administrator/UpdateToolsAdmin";
import SeedHome from "../Jobs/SeedHome";
import SeedContainer from "../Jobs/SeedContainer";
import AddWorkerSeed from "../Jobs/AddWorkerSeed";
import SeedReport from "../Jobs/SeedReport";
import Seed from "../Jobs/Seed";
import HarvestHome from "../Jobs/HarvestHome";
import BalanceGeneral from "../BalanceGeneral/BalanceGeneral";
import AdministrationHome from "../Administrator/AdminitratorHome";
import expensesHome from "../Jobs/expensesHome";
import expenseReport from "../Jobs/expenseReport";
import AddConstCultivos from "../Administrator/AddConstCultivos";
import AddInsumos from "../Administrator/AddInsumos";
import AddMateriales from "../Administrator/AddMateriales";
import Constcultivos from "../Administrator/Constcultivos";
import Insumos from "../Administrator/Insumos";
import ToolsHome from "../Administrator/ToolsHome";
import AddHerramientas from "../Administrator/AddHerramientas";
import Material from "../Administrator/Material";
import UpdateConstCultivos from "../Administrator/UpdateConstCultivos";
import UpdateInsumos from "../Administrator/UpdateInsumos";
import UpdateMateriales from "../Administrator/UpdateMateriales";
import addMaterial from "../Jobs/addMaterial";
import Materials from "../Jobs/Materials";
import Farms from "../Farm/Farm";
import AddFarm from "../Farm/addFarm";
import UpdateFarm from "../Farm/UpdateFarm";
import Rubro from "../Rubro/Rubro";
import AddEmployees from "../Employees/AddEmployees";
import Employees from "../Employees/Employees";
import updateEmployees from "../Employees/UpdateEmployee";
import Corrales from "../corrales/Corrales";
import AddCorral from "../corrales/AddCorral";
import UpdateCorral from "../corrales/UpdateCorral";
import EmployeesMaleza from "../Jobs/EmployeesControlMaleza";
import EmployeesCosechas from "../Jobs/EmployeesCosechas";
import MaterialsCosechas from "../Jobs/MaterialsCosechas";
import EmployeesArado from "../Jobs/EmployeesArado";

import EmployeesChapulin from "../Jobs/EmployeesChapulin";
import EmployeesChapulinSeed from "../Jobs/EmployeesChapulinSeed";
import EmployeesNutrientes from "../Jobs/EmployeesNutrientes";
import EmployeesSemillas from "../Jobs/EmployeesSemilla";
import Production from "../Production/Production";
import Chickens from "../Chickens/Chickens";
import ChickenFarming from "../Chickens/ChickenFarming";
import AddChicken from "../Chickens/AddChicken";
import Stages from "../Chickens/Stages";
import InitialStage from "../Chickens/initialStage/InitialStage";
import GrowthStage from "../Chickens/GrowthStage/GrowthStage";
import FinalStage from "../Chickens/FinalStage/FinalStage";
import AddChickenWorker from "../Chickens/AddChickenWorker";
import AddChickenConcentrate from "../Chickens/AddChickenConcentrate";
import AddChickenMaterial from "../Chickens/AddChickenMaterial";

import EggsProduction from "../Eggs/EggsProduction";
import EggsStages from "../Eggs/EggsStages";
import AddEggs from "../Eggs/AddEggs";
import AddEggsWorker from "../Eggs/AddEggsWorker";
import EggsRawMaterial from "../Eggs/EggsRawMaterial";
import AddEggsMaterial from "../Eggs/AddEggsMaterial";
import AddEggsConcentrate from "../Eggs/AddEggsConcentrate";
import EggsCorralesList from "../Eggs/EggsCorralesList";
import EggsEmployeesList from "../Eggs/EggsEmployeesList";
import EggsInitialStage from "../Eggs/EggsInitialStage";
import EggsGrowthStage from "../Eggs/EggsGrowthStage";
import EggsFinalStage from "../Eggs/EggsFinalStage";
import EggsListConcentrate from "../Eggs/EggsListConcentrate";

import EmployeesList from "../EmployeesList/EmployeesList";
import UpdateChapulin from "../Jobs/UpdateChapulinPlow";
import UpdateChapulinSeed from "../Jobs/UpdateChapulinSeed";

import Warehouse from "../WareHouse/Warehouse";
import Supplies from "../Supplies/Supplies";
import AddMaterials from "../Materials/AddMaterials";
import Materialss from "../Materials/Material";
import UpdateMaterials from "../Materials/UpdateMaterials";
import AddTools from "../Tools/AddTools";
import Tools from "../Tools/Tools";
import UpdateTools from "../Tools/UpdateTools";
import AddFertilizer from "../Fertilizer/AddFertilizer";
import Fertilizer from "../Fertilizer/Fertilizer";
import UpdateFertilizer from "../Fertilizer/UpdateFertilizer";
import AddSeeds from "../Seeds/AddSeeds";
import Seeds from "../Seeds/Seeds";
import UpdateSeeds from "../Seeds/UpdateSeeds";
import AddConcentrate from "../Concentrate/AddConcentrate";
import Concentrate from "../Concentrate/Concentrate";
import UpdateConcentrate from "../Concentrate/UpdateConcentrate";
import UpdateWorkerPlow from "../Jobs/UpdateWorkerPlow";
import CorralesList from "../CorralesList/CorralesList";
import UpdateWorkerHarvest from "../Jobs/UpdateWorkerHarvest";
import UpdateWorkerNutrients from "../Jobs/UpdateWorkerNutrients";
import UpdateProduction from "../Chickens/UpdateProduction";
import AddWorkerInitialStage from "../Chickens/initialStage/AddWorkers";
import UpdateWorkers from "../Chickens/initialStage/UpdateWorers";
import Mercado from "../Mercado/Mercado";
import addMercado from "../Mercado/addMercado";

import updateMercado from "../Mercado/updateMercado";

import Cellar from "../Cellar/Cellar";
import addCellar from "../Cellar/addCellar";
import updateCellar from "../Cellar/updateCellar";
import Menu from "../PrincipalMenu/Menu";
import Producto from "../Mercado/Producto";
import MenuMercado from "../Mercado/MenuMercado";
import ConcentrateList from "../ConcentrateList/ConcentrateList";
import AddFoodInitialState from "../Chickens/initialStage/AddFoodInitialState";
import RawMaterial from "../Chickens/RawMaterial";
import AddWorkerGrowthStage from "../Chickens/GrowthStage/AddWorkers";
import UpdateWorkersGrowthStage from "../Chickens/GrowthStage/UpdateWorers";
import InsumosMenu from "./../Admin/Insumos-menu";
import SemillasMenu from "./../Admin/Seeds/Seed";
import AddSemillas from "./../Admin/Seeds/AddSemillas";
import AdminUpdateSemillas from "./../Admin/Seeds/AdminSemillasUpdate";

import AdminAddAbono from "./../Admin/Fertilizer/AdminAddFertilizer";
import AdminUpdateFertilizer from "./../Admin/Fertilizer/AdminUpdateFertilizer";
import AdminFertilizer from "./../Admin/Fertilizer/AdminFertilizer";

import AdminAddConcentrate from "./../Admin/Concentrates/AdminAddConcentrate";
import AdminConcentrate from "./../Admin/Concentrates/AdminConcentrate";
import AdminUpdateConcentrate from "./../Admin/Concentrates/AdminUpdateConcentrate";
import Concen from "../Concentrate/Concentrado";
import ProductionDetails from "../Production/ProductionDetails";
import AddWorkerFinalStage from "../Chickens/FinalStage/AddWorkers";
import UpdateWorkersFinalStage from "../Chickens/FinalStage/UpdateWorers";
import AddChapulinSeed from "../Jobs/AddChapulinSeed";
import AddFoodGrowthStage from "../Chickens/GrowthStage/AddFoodGrowthStage";
import MaterialList from "../MaterialsList/MaterialList";
import AddMaterialFinalStage from "../Chickens/FinalStage/AddMaterial";
import UpdateMaterialInitialStage from "../Chickens/FinalStage/UpdateMaterials";
import ChickenProduct from "../Chickens/ChickenProduct/ChickenProduct";
import SeedsList from "../Seeds/Semillas";
import Buy from "../Buy/Buy";
import BuyDetails from "../Buy/BuyDetails";

class CustomDrawerComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      lastName: "",
      role: 0
    };
  }

  componentDidMount() {
    fs.collection("users")
      .where("email", "==", firebase.auth().currentUser.email)
      .get()
      .then(query => {
        query.forEach(doc => {
          this.setState({
            name: doc.data().name,
            lastName: doc.data().lastName,
            role: doc.data().role
          });
        });
      });
  }
  render() {
    const { name, lastName, role } = this.state;

    if (role == 2) {
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <View
            style={{
              height: 150,
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Image
              source={require("../../../assets/perfil.png")}
              style={{ height: 110, width: 110, borderRadius: 60 }}
            />
            <Text style={{ fontSize: 16, fontWeight: "500" }}>
              {name + " " + lastName}
            </Text>
          </View>
          <ScrollView>
            <DrawerItems {...this.props} />
            <Button
              transparent
              onPress={() => {
                this.props.navigation.navigate("menu");
              }}
            >
              <Text style={{ color: "#000", fontWeight: "bold", fontSize: 15 }}>
                Menú
              </Text>
            </Button>
            <Button
              transparent
              onPress={() => {
                this.props.navigation.navigate("administrationHome");
              }}
            >
              <Text style={{ color: "#000", fontWeight: "bold", fontSize: 15 }}>
                Administrar
              </Text>
            </Button>

            <SignOutButton />
          </ScrollView>
        </SafeAreaView>
      );
    } else {
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <View
            style={{
              height: 150,
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Image
              source={require("../../../assets/perfil.png")}
              style={{ height: 110, width: 110, borderRadius: 60 }}
            />
            <Text style={{ fontSize: 16, fontWeight: "500" }}>
              {name + " " + lastName}
            </Text>
          </View>
          <ScrollView>
            <DrawerItems {...this.props} />
            <Button
              transparent
              onPress={() => {
                this.props.navigation.navigate("menu");
              }}
            >
              <Text style={{ color: "#000", fontWeight: "bold", fontSize: 15 }}>
                Menú
              </Text>
            </Button>
            <SignOutButton />
          </ScrollView>
        </SafeAreaView>
      );
    }
  }
}
const DrawerNavigatorFarm = createDrawerNavigator(
  {
    Farms: {
      screen: Farms
    },
    Perfil: {
      screen: UserDetails
    }
  },
  {
    contentComponent: CustomDrawerComponent
  }
);

const AppNavigator = createStackNavigator({
  menu: {
    screen: Menu
  },

  Perfil: {
    screen: UserDetails
  },
  UpdateToolsCant: {
    screen: UpdateToolsCant
  },
  rubro: {
    screen: Rubro
  },

  Estimaciones: {
    screen: Estimations
  },
  profile: {
    screen: Profile
  },
  addEstimations: {
    screen: AddEstimations
  },
  Labores: {
    screen: Jobs
  },
  addSuelo: {
    screen: AddSuelo
  },
  ToolsHome: {
    screen: ToolsHome
  },
  AddHerramientas: {
    screen: AddHerramientas
  },
  Bodega: {
    screen: Bodega
  },
  UpdateBHarvest: {
    screen: UpdateBHarvest
  },
  UpdateBProduction: {
    screen: UpdateBProduction
  },
  addSowing: {
    screen: AddSowing
  },
  UpdateWorkerHarvest: {
    screen: UpdateWorkerHarvest
  },
  UpdateWorkerNutrients: {
    screen: UpdateWorkerNutrients
  },
  addCosecha: {
    screen: addHarvest
  },
  cardDetails: {
    screen: CardDetails
  },
  updateEstimations: {
    screen: UpdateEstimations
  },
  updateSowing: {
    screen: UpdateSowing
  },
  updateSuelo: {
    screen: UpdateSuelo
  },
  addWorker: {
    screen: AddWorker
  },
  addWorkerCosecha: {
    screen: AddWorkerCosecha
  },
  updateHarvest: {
    screen: updateHarvest
  },
  updateWorkerSeed: {
    screen: updateWorkerSeed
  },
  userDetails: {
    screen: UserDetails
  },
  soilHome: {
    screen: SoilHome
  },
  addChemical: {
    screen: AddChemical
  },
  soilReport: {
    screen: SoilReport
  },
  plowHome: {
    screen: PlowHome
  },
  plowWorkers: {
    screen: AddWorkerPlow
  },
  addChapulin: {
    screen: AddChapulin
  },
  nutrientsHome: {
    screen: NutrientsHome
  },
  addWorkerNutrients: {
    screen: AddWorkerNutrients
  },
  addAlkanization: {
    screen: AddAlkalinization
  },
  seedHome: {
    screen: SeedHome
  },
  seedContainer: {
    screen: SeedContainer
  },
  addWorkerSeed: {
    screen: AddWorkerSeed
  },
  seedReport: {
    screen: SeedReport
  },
  addSeedChapulin: {
    screen: AddChapulinSeed
  },
  seed: {
    screen: Seed
  },
  harvestHome: {
    screen: HarvestHome
  },
  Balance: {
    screen: BalanceGeneral
  },
  constcultivos: {
    screen: Constcultivos
  },
  insumos: {
    screen: Insumos
  },
  Material: {
    screen: Material
  },
  administrationHome: {
    screen: AdministrationHome
  },
  UpdateToolsAdmin: {
    screen: UpdateToolsAdmin
  },
  addConstCultivos: {
    screen: AddConstCultivos
  },
  updateConstCultivos: {
    screen: UpdateConstCultivos
  },
  addInsumos: {
    screen: AddInsumos
  },
  updateInsumos: {
    screen: UpdateInsumos
  },
  addMateriales: {
    screen: AddMateriales
  },
  updateMateriales: {
    screen: UpdateMateriales
  },
  harvestHome: {
    screen: HarvestHome
  },
  expensesHome: {
    screen: expensesHome
  },
  addHarvest: {
    screen: addHarvest
  },
  addMaterial: {
    screen: addMaterial
  },
  Materials: {
    screen: Materials
  },
  addFarm: {
    screen: AddFarm
  },
  updateFarm: {
    screen: UpdateFarm
  },
  addEmployees: {
    screen: AddEmployees
  },
  employees: {
    screen: Employees
  },
  updateEmployees: {
    screen: updateEmployees
  },
  corrales: {
    screen: Corrales
  },
  addCorral: {
    screen: AddCorral
  },
  updateCorral: {
    screen: UpdateCorral
  },
  expenseReport: {
    screen: expenseReport
  },
  employeesMaleza: {
    screen: EmployeesMaleza
  },
  employeesCosechas: {
    screen: EmployeesCosechas
  },
  materialsCosechas: {
    screen: MaterialsCosechas
  },
  employeesArado: {
    screen: EmployeesArado
  },
  employeesChapulin: {
    screen: EmployeesChapulin
  },
  employeesChapulinSeed: {
    screen: EmployeesChapulinSeed
  },
  employeesNutrientes: {
    screen: EmployeesNutrientes
  },
  employeesSemillas: {
    screen: EmployeesSemillas
  },
  TabTools: {
    screen: TabTools
  },
  Production: {
    screen: Production
  },
  Chickens: {
    screen: Chickens
  },
  EggsProduction: {
    screen: EggsProduction
  },
  EggsStages: {
    screen: EggsStages
  },
  AddEggs: {
    screen: AddEggs
  },
  AddEggsWorker: {
    screen: AddEggsWorker
  },
  AddEggsMaterial: {
    screen: AddEggsMaterial
  },
  AddEggsConcentrate: {
    screen: AddEggsConcentrate
  },
  EggsCorralesList: {
    screen: EggsCorralesList
  },
  EggsRawMaterial: {
    screen: EggsRawMaterial
  },
  EggsEmployeesList: {
    screen: EggsEmployeesList
  },
  EggsListConcentrate: {
    screen: EggsListConcentrate
  },
  EggsInitialStage: {
    screen: EggsInitialStage
  },
  EggsGrowthStage: {
    screen: EggsGrowthStage
  },
  EggsFinalStage: {
    screen: EggsFinalStage
  },
  AddChicken: {
    screen: AddChicken
  },
  Stages: {
    screen: Stages
  },
  ChickenFarming: {
    screen: ChickenFarming
  },
  InitialStage: {
    screen: InitialStage
  },
  GrowthStage: {
    screen: GrowthStage
  },
  finalStage: {
    screen: FinalStage
  },
  AddChickenWorker: {
    screen: AddChickenWorker
  },
  AddChickenConcentrate: {
    screen: AddChickenConcentrate
  },
  AddChickenMaterial: {
    screen: AddChickenMaterial
  },

  employeesList: {
    screen: EmployeesList
  },
  updateChapulin: {
    screen: UpdateChapulin
  },
  updateChapulinSeed: {
    screen: UpdateChapulinSeed
  },
  warehouse: {
    screen: Warehouse
  },
  supplies: {
    screen: Supplies
  },
  addMaterials: {
    screen: AddMaterials
  },
  materials: {
    screen: Materialss
  },
  updateMaterials: {
    screen: UpdateMaterials
  },
  addTools: {
    screen: AddTools
  },
  ToolsCantidad: {
    screen: ToolsCantidad
  },
  tools: {
    screen: Tools
  },
  updateTools: {
    screen: UpdateTools
  },
  addFertilizer: {
    screen: AddFertilizer
  },
  fertilizer: {
    screen: Fertilizer
  },
  updateFertilizer: {
    screen: UpdateFertilizer
  },
  addSeeds: {
    screen: AddSeeds
  },
  seeds: {
    screen: Seeds
  },
  updateSeeds: {
    screen: UpdateSeeds
  },
  addConcentrate: {
    screen: AddConcentrate
  },
  concentrate: {
    screen: Concentrate
  },
  updateConcentrate: {
    screen: UpdateConcentrate
  },
  updateWorkerPlow: {
    screen: UpdateWorkerPlow
  },
  showWorkerPlow: {
    screen: ShowWorkerPlow
  },
  corralesList: {
    screen: CorralesList
  },
  updateProduction: {
    screen: UpdateProduction
  },
  addWorkerInitialStage: {
    screen: AddWorkerInitialStage
  },
  updateWorkersInitialStage: {
    screen: UpdateWorkers
  },
  menuMercado: {
    screen: MenuMercado
  },
  mercado: {
    screen: Mercado
  },
  addmercado: {
    screen: addMercado
  },
  updatemercado: {
    screen: updateMercado
  },
  cellar: {
    screen: Cellar
  },
  addcellar: {
    screen: addCellar
  },
  updatecellar: {
    screen: updateCellar
  },
  producto: {
    screen: Producto
  },
  concentrateList: {
    screen: ConcentrateList
  },
  addFoodInitialState: {
    screen: AddFoodInitialState
  },
  rawMaterial: {
    screen: RawMaterial
  },
  addWorkerGrowthStage: {
    screen: AddWorkerGrowthStage
  },
  updateWorkersGrowthStage: {
    screen: UpdateWorkersGrowthStage
  },
  insumosMenu: {
    screen: InsumosMenu
  },
  semillasMenu: {
    screen: SemillasMenu
  },
  addSemillas: {
    screen: AddSemillas
  },
  addConcentrateAdmin: {
    screen: AdminAddConcentrate
  },
  concentrateAdmin: {
    screen: AdminConcentrate
  },
  updateConcentrateAdmin: {
    screen: AdminUpdateConcentrate
  },
  concen: {
    screen: Concen
  },
  adminUpdateSemillas: {
    screen: AdminUpdateSemillas
  },
  productionDetails: {
    screen: ProductionDetails
  },
  adminAddAbono: {
    screen: AdminAddAbono
  },
  adminUpdateAbono: {
    screen: AdminUpdateFertilizer
  },
  adminAbono: {
    screen: AdminFertilizer
  },
  addWorkerFinalStage: {
    screen: AddWorkerFinalStage
  },
  updateWorkersFinalStage: {
    screen: UpdateWorkersFinalStage
  },

  seedslist: {
    screen: SeedsList
  },
  addFoodGrowthStage: {
    screen: AddFoodGrowthStage
  },
  materialList: {
    screen: MaterialList
  },
  addMaterialFinalStage: {
    screen: AddMaterialFinalStage
  },
  updateMaterialInitialStage: {
    screen: UpdateMaterialInitialStage
  },
  chickenProduct: {
    screen: ChickenProduct
  },
  buy: {
    screen: Buy
  },
  buyDetails: {
    screen: BuyDetails
  }
});

export default createAppContainer(
  createSwitchNavigator(
    {
      Farms: DrawerNavigatorFarm,
      Auth: AppNavigator
    },
    {
      initialRouteName: "Auth"
    }
  )
);
