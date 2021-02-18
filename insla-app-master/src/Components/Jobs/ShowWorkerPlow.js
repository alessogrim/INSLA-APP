import React, { Component } from "react";
import { View, StyleSheet, TextInput, ScrollView, Alert } from "react-native";
import {
    Text,
    Form,
    Content,
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
    Row
} from "native-base";
import { firebase, fs } from "../Firebase/config";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import home from "./PlowHome";
export default class ShowWorkerPlow extends Component {
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
            empleado: this.props.navigation.state.params,
            id: this.props.navigation.state.params.data().identidad,
            name: this.props.navigation.state.params.data().name,
            lastName: this.props.navigation.state.params.data().lastName,
            payDay: this.props.navigation.state.params.data().payDay,
            dayWorked: this.props.navigation.state.params.data().dayWorked,
            age: this.props.navigation.state.params.data().age,
            description: this.props.navigation.state.params.data().description,
            idEstimation: this.props.navigation.state.params.data().idEstimation,
            idlistempleado: this.props.navigation.state.params.data().idlistempleado,
            Loaded: true,
        };
    }


    render() {
        const {
            estimation,

            id,

            name,

            lastName,

            dayWorked,

            payDay,

            age,

            description,

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
                <View
                    style={{
                        display: "flex",
                        flexDirection: "column"
                    }}
                >
                    <Header style={styles.headerStyle}>
                        <Left>
                            <Icon
                                type="MaterialIcons"
                                name="arrow-back"
                                style={styles.iconStyle}
                                onPress={() => this.props.navigation.navigate("nutrientsHome")}
                            />
                        </Left>
                        <Body>
                            <Title style={styles.titleStyle}>EMPLEADO</Title>
                        </Body>
                        <Right />
                    </Header>
                    <View
                        style={{
                            display: "flex",
                            height: "100%",
                            alignItems: "center"
                        }}
                    >
                        <ScrollView scrollEnabled="false" style={{ width: "100%" }}>
                            <KeyboardAwareScrollView
                                resetScrollToCoords={{ x: 0, y: 0 }}
                                keyboardOpeningTime={250}
                                ScroolEnable={false}
                            >
                                <View
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        alignItems: "center"
                                    }}
                                >
                                    <View
                                        style={{
                                            marginTop: "10%",
                                            width: "100%",
                                            display: "flex",
                                            alignItems: "center"
                                        }}
                                    >
                                        <Item
                                            floatingLabel
                                            style={{ width: "80%", height: 45 }}
                                            success={this.state.sId}
                                            error={this.state.eId}
                                        >
                                            <Icon type="MaterialIcons" name="accessibility" />
                                            <Label>No. identidad</Label>
                                            <Input
                                                disabled
                                                keyboardType="numeric"
                                                style={{ fontSize: 18, alignSelf: "flex-start" }}
                                                value={this.state.id}
                                            //value={"" + this.state.identidad}
                                            />

                                        </Item>
                                    </View>
                                    <View
                                        style={{
                                            marginTop: "10%",
                                            width: "100%",
                                            display: "flex",
                                            alignItems: "center"
                                        }}
                                    >
                                        <Item
                                            floatingLabel
                                            style={{ width: "80%", height: 45 }}
                                            success={this.state.sName}
                                            error={this.state.eName}
                                        >
                                            <Icon type="MaterialIcons" name="person" />
                                            <Label>Nombre</Label>
                                            <Input
                                                disabled
                                                style={{ fontSize: 18, alignSelf: "flex-start" }}

                                                value={"" + this.state.name}
                                            />

                                        </Item>
                                    </View>

                                    <View
                                        style={{
                                            width: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            marginTop: 8
                                        }}
                                    >
                                        <Item
                                            floatingLabel
                                            style={{ width: "80%", height: 45 }}
                                            success={this.state.sLastNameName}
                                            error={this.state.eLastNameName}
                                        >
                                            <Icon type="MaterialIcons" name="people" />
                                            <Label>Apellido</Label>
                                            <Input
                                                disabled
                                                style={{ fontSize: 18 }}

                                                value={"" + this.state.lastName}
                                            />

                                        </Item>
                                    </View>
                                    <View
                                        style={{
                                            width: "80%",
                                            display: "flex",
                                            alignItems: "center",
                                            marginTop: 8
                                        }}
                                    >
                                        <Item
                                            floatingLabel
                                            style={{
                                                width: "40%",
                                                height: 45,
                                                alignSelf: "flex-start"
                                            }}

                                        >
                                            <Icon type="MaterialIcons" name="fingerprint" />
                                            <Label>Edad</Label>
                                            <Input
                                                disabled
                                                keyboardType="number-pad"
                                                style={{
                                                    fontSize: 18
                                                }}

                                                value={"" + this.state.age}
                                            />

                                        </Item>
                                    </View>
                                    <View
                                        style={{
                                            width: "80%",
                                            display: "flex",
                                            alignItems: "center",
                                            marginTop: 8
                                        }}
                                    >
                                        <Item
                                            floatingLabel
                                            style={{
                                                width: "60%",
                                                height: 45,
                                                alignSelf: "flex-start"
                                            }}

                                        >
                                            <Icon type="MaterialIcons" name="access-time" />
                                            <Label>Dias trabajados</Label>
                                            <Input
                                                disabled
                                                keyboardType="number-pad"
                                                style={{ fontSize: 18 }}
                                                onChangeText={dayWorked => this.setState({ dayWorked })}
                                                value={"" + this.state.dayWorked}
                                            />
                                        </Item>
                                    </View>
                                    <View
                                        style={{
                                            width: "80%",
                                            display: "flex",
                                            alignItems: "center",
                                            marginTop: 8
                                        }}
                                    >
                                        <Item
                                            floatingLabel
                                            style={{
                                                width: "60%",
                                                height: 60,
                                                alignSelf: "flex-start"
                                            }}

                                        >
                                            <Icon type="MaterialIcons" name="attach-money" />
                                            <Label>Pago por día</Label>
                                            <Input
                                                disabled
                                                keyboardType="numeric"
                                                style={{ fontSize: 18 }}
                                                onChangeText={payDay => this.setState({ payDay })}
                                                value={"" + this.state.payDay}
                                            />

                                        </Item>
                                    </View>
                                    <View
                                        style={{
                                            marginTop: "10%",
                                            width: "100%",
                                            display: "flex",
                                            alignItems: "center"
                                        }}
                                    >
                                        <Item
                                            floatingLabel
                                            style={{ width: "80%", height: 45 }}
                                            success={this.state.sId}
                                            error={this.state.eId}

                                        >
                                            <Icon type="MaterialIcons" name="description" />
                                            <Label>Actividad Realizada</Label>
                                            <Input
                                                disabled
                                                style={{ fontSize: 18, alignSelf: "flex-start" }}
                                                value={this.state.description}
                                            //value={"" + this.state.identidad}
                                            />

                                        </Item>
                                    </View>
                                </View>
                            </KeyboardAwareScrollView>
                        </ScrollView>
                    </View>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    titleStyle: {
        color: "#fff"
    },
    container: {
        flexDirection: "column",
        height: "100%"
    },
    headerStyle: {
        borderBottomColor: "#fff",
        backgroundColor: "#077A65",
        height: 80
    },
    iconStyle: {
        fontSize: 40,
        color: "#fff"
    },

    buttonStyle: {
        backgroundColor: "#077A65",
        marginTop: 30,
        marginLeft: 10,
        marginRight: 10,
        width: "70%"
    },
    labelStyle: {
        marginTop: 8,
        marginLeft: 10,
        marginRight: 10
    },
    itemStyle: {
        height: 50,
        //marginLeft: 10,
        //marginRight: 10,
        top: -10,
        borderWidth: 1,
        borderColor: "#077A65",
        //backgroundColor: "#7fff00",
        width: "25%"
    },
    errorValitation: {
        borderColor: "red"
    }
});
