import React, { Component } from "react";
import { View, StyleSheet, TextInput, ScrollView, Alert } from "react-native";
import {
  Container,
  Text,
  Textarea,
  Header,
  Left,
  Body,
  Title,
  Right,
  Icon,
  Item,
  Label,
  Button,
  Spinner,
  Input,
  Form,
  Row,
  Content
} from "native-base";
import { firebase, fs } from "../Firebase/config";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class addMaterial extends Component {
  static navigationOptions = () => {
    let headerLeft = null;
    let gesturesEnabled = false;
    let header = null;
    return {
      headerLeft,
      header,
      gesturesEnabled
    };
  };
  constructor(props) {
    super(props);

    this.state = {
      estimation: {},
      material:this.props.navigation.state.params.material,
      id:this.props.navigation.state.params.material.data().id,
      name: this.props.navigation.state.params.material.data().name,
      brand: this.props.navigation.state.params.material.data().brand,
      description: this.props.navigation.state.params.material.data().description,
      quantity: 0,
      Loaded: true,
      idmateriallist:this.props.navigation.state.params.material.id,

      //errors inputs
      eQuantity: false,

      //succes inputs
      sQuantity: false,

      //icon inputs
      iQuantity: "close-circle",

    };
  }

   // :::::::::::::::::::::: VALIDATIONS ::::::::::::::::::::::
   validate = (data, type) => {
    const regexQuantity = /\d{1,3}/;

    if (type === "quantity") {
      if (regexQuantity.test(data)) {
        this.setState({
          quantity: data,
          eQuantity: false,
          sQuantity: true,
          iQuantity: "ios-checkmark-circle"
        });
      } else {
        this.setState({
          quantity: data,
          eQuantity: false,
          sQuantity: true,
          iQuantity : "ios-checkmark-circle"
        });
      }
    }
  };

  //::::::::::::::::::::::::END VALIDATION ::::::::::::::::::::::
  componentDidMount() {
    let action;
    if (this.props && this.props.navigation && this.props.navigation.state && this.props.navigation.state.params.estimacion && this.props.navigation.state.params.estimacion.action) {
      action = this.props.navigation.state.params.estimacion.action;
    }
    if (action === "edit") {
      let material = this.props.navigation.state.params.estimacion.doc.data();
      this.setState({
        estimation: this.props.navigation.state.params.estimacion.estimation,
        Loaded: true,
        id: "" + material.id,
        name: "" + material.name,
        brand: "" + material.brand,
        description: "" + material.description,
        quantity: "" + material.quantity
      });
    } else {
      if (this.props.navigation && this.props.navigation.state && this.props.navigation.state.params.estimacion) {
        this.setState({
          estimation: this.props.navigation.state.params.estimacion,
          Loaded: true
        });
      }
    }
  }


 

  saveMaterial = () => {
    const {
      material,
      estimation,
      id,
      name,
      brand,
      description,
      quantity,
      sQuantity,
      idmateriallist,
    } = this.state;

    console.log(sQuantity);
    if (sQuantity) {
      fs.collection("harvestMaterials")
        .add({
          idEstimation: estimation.id,
          id,
          name,
          brand,
          quantity: parseInt(quantity),
          description,
          idlistmaterial:idmateriallist
        })
        .then(tool => {
          fs.collection("materials")
          .doc(material.id)
          /*.update({
            status:true
          })*/
          this.setState({
            Loaded: true
          });
          this.props.navigation.state.params.save(tool.id);
          this.props.navigation.navigate("expensesHome");          
        });
      }  
  };

  render() {
    const {
      estimation,
      
      id,
     
      name,
      
      brand,
      
      description,

      quantity,
      
      Loaded,
    } = this.state;
    if (!Loaded) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Spinner color="green" />
        </View>
      );
    } else {
      return (
        <Container>
          <Header
            style={{
              borderBottomColor: "#fff",
              backgroundColor: "#077A65",
              height: 80
            }}
          >
            <Left>
              <Icon
                type="MaterialIcons"
                name="arrow-back"
                style={{
                  fontSize: 40,
                  color: "#fff",
                  padding: 5
                }}
                onPress={() => this.props.navigation.navigate("expensesHome")}
              />
            </Left>
            <Body>
              <Title  style={{ color: "#fff"}}>MATERIAL</Title>
            </Body>
            <Right />
          </Header>
          <ScrollView
            style={{
              flex: 1
            }}
          >
            <KeyboardAwareScrollView
              resetScrollToCoords={{ x: 0, y: 0 }}
              keyboardOpeningTime={250}
              ScroolEnable={false}
            >
              <Form style={style.container}>
              <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    width: "100%",
                    alignItems: "center"
                  }}
                >
                  <Item
                    floatingLabel
                    style={{ width: "90%", height: 60 }}
                  >
                    <Icon type="MaterialIcons" name="accessibility" />
                    <Label>ID</Label>
                    <Input
                      disabled
                      maxLength={13}
                      keyboardType="number-pad"
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      value={this.state.id + ""}
                    />
                  </Item>
                </View>

                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    width: "100%",
                    alignItems: "center"
                  }}
                >
                  <Item
                    floatingLabel
                    style={{ width: "90%", height: 60 }}
                  >
                    <Icon type="MaterialIcons" name="person" />
                    <Label>Nombre</Label>
                    <Input
                      disabled
                      style={{
                        fontSize: 18,
                        alignSelf: "flex-start"
                      }}
                      value={""+this.state.name}
                    />
                  </Item>
                </View>

                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    width: "100%",
                    alignItems: "center"
                  }}
                >
                  <Item
                    floatingLabel
                    style={{ width: "90%", height: 60 }}
                  >
                    <Icon type="MaterialIcons" name="people" />
                    <Label>Brand</Label>
                    <Input
                      disabled
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      value={""+ this.state.brand}
                    />
                  </Item>
                </View>

                <View
                    style={{
                      width: "100%",
                      display: "flex",
                      alignSelf: "flex-start",
                      alignItems: "center",
                      marginTop: 30
                    }}
                  >
                    <Row                         
                        style={{
                        width: "90%",                      
                        }}>
                        <Icon type="MaterialIcons" name="description" style={{ fontSize: 20, marginRight: 2}} />
                        <Label>Descripción</Label>
                    </Row>
                    <Content padder style={{width: "95%"}}>
                      <Form>
                        <Textarea
                          disabled 
                          rowSpan={3} 
                          bordered 
                          value={"" + this.state.description} 
                        />
                      </Form>
                      </Content>
                  </View>

                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    width: "100%",
                    alignItems: "center"  
                  }}
                >
                  <Item
                    floatingLabel
                    style={{ width: "90%", height: 60 }}
                    error={this.state.eQuantity}
                    success={this.state.sQuantity}
                  >
                    <Icon type="MaterialIcons" name="all-inclusive" />
                    <Label>Cantidad</Label>
                    <Input
                      maxLength={3}
                      keyboardType="number-pad"
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={quantity => this.validate(quantity, "quantity")}
                    />
                    <Icon name={this.state.iQuantity} />
                  </Item>
                </View>

                <View
                  style={{
                    marginTop: "10%",
                    marginBottom: "10%",
                    width: "60%"
                  }}
                >
                  <Button
                    style={style.addButton}
                    full
                    rounded
                    success
                    onPress={this.saveMaterial}
                  >
                    <Text style={{ color: "white" }}>GUARDAR</Text>
                  </Button>
                </View>
              </Form>
            </KeyboardAwareScrollView>
          </ScrollView>
        </Container>
      );
    }
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column"
  },
  addButton: {
    backgroundColor: "#077A65"
  },
  fields: {
    margin: "5%",
    width: "50%",
    flex: 50
  },
  errorValitation: {
    borderColor: "red"
  }
});
