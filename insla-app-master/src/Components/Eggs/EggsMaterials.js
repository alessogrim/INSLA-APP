import React, { Component } from "react";
import { Text, StyleSheet, Alert, ScrollView } from "react-native";
import {
  Header, Left, Right, Body, Icon, Container, Fab,
  ListItem, Thumbnail, Row
} from "native-base";
import { fs } from "../Firebase/config";

export default class Materials extends Component {
  state = {
    materials: [],
    Loaded: false
  }

  componentDidMount() {
    this.getMaterials()
  }

  async createMaterials(newMaterial) {
    await fs.collection('eggsMaterial').add(newMaterial)
    // await fs.collection("employees").doc(newConcentrate.employee).update({
    //   status: true
    // });
  }

  async getMaterials() {
    const { production } = this.props.navigation.state.params
    const querySnapshot = await fs.collection("eggsMaterial")
      .where("production", "==", production._id)
      .get();
    let materials = [];
    querySnapshot.forEach(doc => {
      const document = {
        _id: doc.id,
        ...doc.data()
      };
      materials.push(document);
    });
    const populeteMaterial = materials.map(async material => {
      const materialDoc = await fs.collection("materials")
        .doc(material.material)
        .get()
      material.materialData = materialDoc.data();
      console.log(material.materialData)
      return material;
    });
    materials = await Promise.all(populeteMaterial)
    this.setState({
      materials: materials,
      Loaded: true
    });
  }

  deleteMaterial(material) {
    Alert.alert(
      "Borrar Producción",
      "¿Esta seguro que desea borrar este material?",
      [
        {
          text: "Cancelar",

          style: "Cancelar"
        },
        {
          text: "Aceptar",
          onPress: async () => {
            await fs.collection("eggsMaterial")
              .doc(material._id)
              .delete()
            this.setState({
              materials: this.state.materials.filter((mat) => {
                return mat._id !== material._id;
              })
            });
            // await fs.collection("employees").doc(concentrate.employee).update({
            //   status: false
            // });
          }
        }
      ],
      { cancelable: false }
    );
  }

  render() {
    const { farm, production } = this.props.navigation.state.params
    const showMaterials = this.state.materials.map((mat) => {
      return (
        <ListItem avatar>
          <Left>
            <Thumbnail
              source={require("../../../assets/straw.png")}
            />
          </Left>
          <Body>
            <Text>{mat.materialData.name}</Text>
            <Text note>
              {mat.materialData.id.substr(0, 4) +
                "-" +
                mat.materialData.id.substr(4, 4) +
                "-" +
                mat.materialData.id.substr(8, 13)}
            </Text>
            <Text note>{`Brand: ${mat.brand}`}</Text>
          </Body>
          <Right>
            <Row >
              <Icon
                type="MaterialIcons"
                name="delete"
                style={{ color: "red", fontSize: 30 }}
                onPress={() => this.deleteMaterial(mat)}
              />
            </Row>
          </Right>
        </ListItem>
      )
    });
    return (
      <>
        <Container
          style={{
            marginLeft: 3,
            marginRight: 3
          }}
        >
          <ScrollView>
            {showMaterials}
          </ScrollView>
        </Container>
        <Fab
          direction="up"
          style={{
            backgroundColor: "#077A65",
            padding: 0,
            margin: 0,
            position: "absolute"
          }}
          position="bottomRight"
          onPress={() => {
            this.props.navigation.navigate("materials", {
              farm,
              onSelect: (material) => {
                console.log(material.data());
                this.props.navigation.navigate("AddEggsMaterial", {
                  material: material.data(),
                  onCreate: async (eggsMaterial) => {
                    const newEggsMaterial = {
                      ...eggsMaterial,
                      material: material.id,
                      production: production._id
                    };
                    await this.createMaterials(newEggsMaterial);
                    this.props.navigation.navigate('EggsFinalStage');
                    await this.getMaterials();
                  }
                });
              }
            });
          }}
        >
          <Icon type="FontAwesome5" name="plus" />
        </Fab>
      </>
    );
  }
}
