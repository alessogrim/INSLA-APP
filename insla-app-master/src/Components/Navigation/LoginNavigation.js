import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import Register from "../Register/Register";
import loginEmail from "../Login/loginEmail";
import PasswordReset from "../Login/PasswordReset";

const loginNavigator = createStackNavigator(
  {
    registro: {
      screen: Register
    },
    loginEmail: {
      screen: loginEmail
    },
    forgotPassword: {
      screen: PasswordReset
    }
  },
  {
    initialRouteName: "loginEmail"
  }
);

export default createAppContainer(loginNavigator);
