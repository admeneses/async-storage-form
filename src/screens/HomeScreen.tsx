import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../constants/colors';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const loginDataString = await AsyncStorage.getItem('@MeuApp:loginData');
      
      if (loginDataString) {
        const loginData = JSON.parse(loginDataString);
        if (loginData.isAuthenticated && loginData.email) {
          setUserEmail(loginData.email);
          setIsLoggedIn(true);
        } else {
          navigation.navigate('Login');
        }
      } else {
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error('Erro ao verificar status de login:', error);
      navigation.navigate('Login');
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Tem certeza que deseja sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              // Verificar se deve manter as credenciais salvas
              const rememberUser = await AsyncStorage.getItem('@MeuApp:rememberUser');
              
              if (rememberUser !== 'true') {
                // Se não deve lembrar usuário, limpar tudo
                await AsyncStorage.multiRemove([
                  '@MeuApp:loginData',
                  '@MeuApp:savedCredentials',
                ]);
              } else {
                // Se deve lembrar usuário, manter credenciais mas remover sessão
                await AsyncStorage.removeItem('@MeuApp:loginData');
              }
              
              navigation.navigate('Login');
            } catch (error) {
              console.error('Erro no logout:', error);
              Alert.alert('Erro', 'Ocorreu um erro durante o logout');
            }
          },
        },
      ]
    );
  };

  const clearAllData = async () => {
    Alert.alert(
      'Limpar Dados',
      'Isso irá remover todos os dados salvos, incluindo credenciais e preferências. Continuar?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              navigation.navigate('Login');
            } catch (error) {
              console.error('Erro ao limpar dados:', error);
              Alert.alert('Erro', 'Ocorreu um erro ao limpar os dados');
            }
          },
        },
      ]
    );
  };

  const showStoredData = async () => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const allData = await AsyncStorage.multiGet(allKeys);
      
      let dataText = 'Dados armazenados:\n\n';
      allData.forEach(([key, value]) => {
        dataText += `${key}: ${value}\n`;
      });
      
      Alert.alert('Dados do AsyncStorage', dataText);
    } catch (error) {
      console.error('Erro ao mostrar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados');
    }
  };

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo!</Text>
      <Text style={styles.subtitle}>Você está logado como:</Text>
      <Text style={styles.email}>{userEmail}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dataButton} onPress={showStoredData}>
          <Text style={styles.dataButtonText}>Ver Dados Salvos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.clearButton} onPress={clearAllData}>
          <Text style={styles.clearButtonText}>Limpar Todos os Dados</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    color: colors.textMuted,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 5,
    color: colors.textSecondary,
  },
  email: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: colors.primary,
  },
  buttonContainer: {
    marginBottom: 40,
  },
  logoutButton: {
    backgroundColor: colors.buttonDanger,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: colors.shadowDark,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  logoutButtonText: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: 'bold',
  },
  dataButton: {
    backgroundColor: colors.success,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  dataButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: colors.buttonWarning,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  clearButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.textPrimary,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 5,
    color: colors.textMuted,
  },
});

export default HomeScreen;
