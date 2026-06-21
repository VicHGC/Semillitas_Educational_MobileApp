import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './assets/css/CreateSon_Styles';
import { TextInput as PaperInput, Button as PaperButton, Checkbox } from 'react-native-paper'; 
import SideMenu from './SideMenu'; 
import { useNavigation } from '@react-navigation/native';
import apiClient from './utils/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MenuIconLocal = require('./assets/FatherMainAssets/MenuIcon.png');
const SemillinIconLocal = require('./assets/FatherMainAssets/Semillin.png');

export default function CreateSon() {
  const menuRef = useRef();
  const navigation = useNavigation();
  
  const [name, setNombre] = useState('');
  const [age, setEdad] = useState('');

  const [checkedEsp, setCheckedEsp] = useState(false);
  const [checkedMat, setCheckedMat] = useState(false);

  const SendSon = async () => {
    let response; 
    
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
        Alert.alert('Error de Sesión', 'No se encontró la sesión. Por favor, vuelve a iniciar sesión.');
        return;
    }

    if (!name || !age) {
        Alert.alert('Faltan datos', 'Por favor, rellena el nombre y la edad.');
        return; 
    }

    // --- 1. CONSTRUIR EL ARRAY DE MÓDULOS ---
    // Importante: Estos nombres ("Español", "Matemáticas") deben coincidir 
    // EXACTAMENTE con como están escritos en tu tabla 'modules' de la base de datos.
    let selectedModules = [];
    if (checkedEsp) selectedModules.push("Español");
    if (checkedMat) selectedModules.push("Matemáticas");

    // Validación opcional: Obligar a elegir al menos uno
    if (selectedModules.length === 0) {
        Alert.alert('Atención', 'Debes seleccionar al menos un módulo para que el niño aprenda.');
        return;
    }

    const DEFAULT_AVATAR_URL = 'https://pub-b8d90bf906d3498aa934aae83a10a3d3.r2.dev/basicAvatar.PNG';

    // --- 2. PREPARAR EL OBJETO A ENVIAR ---
    // Enviamos 'modules' en lugar de 'module'
    const sonData = { 
        name, 
        age, 
        modules: selectedModules,
        avatar_url: DEFAULT_AVATAR_URL 
    };

    try {
        response = await apiClient.post(
            '/crearHijo/crearHijo', 
            sonData
        );
        
        const newSonId = response.data.userID;

        if (newSonId) { 
            console.log('Hijo creado exitosamente con ID:', newSonId);
            Alert.alert(
                '¡Registro Exitoso!', 
                `Hijo agregado`,
                [
                    { 
                        text: "OK", 
                        onPress: () => navigation.goBack() 
                    }
                ]
            );
        } else {
            Alert.alert('Fallo', 'El servidor no devolvió el ID del nuevo hijo.');
        }

    } catch (error) {
        if (error.response) {
            let errorData = error.response.data;
            let errorMessage = errorData?.message;
            
            if (!errorMessage) {
              errorMessage = JSON.stringify(errorData);
            }
            
            if (error.response.status === 401) {
                 errorMessage = "Sesión no autorizada. Token inválido o expirado.";
            }

            Alert.alert('Fallo del Servidor', String(errorMessage) || 'Error desconocido del servidor.');
        } else {
            Alert.alert('Error de Conexión', 'No se pudo conectar al servidor. Revisa tu IP y conexión Wi-Fi.');
        }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => menuRef.current.toggleMenu()}>
          <Image source={MenuIconLocal} style={styles.menuIcon} />
        </TouchableOpacity>

        <Text style={styles.headerText}>Agregar Hijo</Text>

        <Image source={SemillinIconLocal} style={styles.semillinImage} />
      </View>

      <View style={styles.content}>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Nombre:</Text>
          <PaperInput
            mode="outlined"
            placeholder="Escribe el nombre"
            style={styles.inputPaper}
            outlineColor="#b38900ff"
            activeOutlineColor="#b38900ff"
            onChangeText={setNombre}
          />
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Edad:</Text>
          <PaperInput
            mode="outlined"
            placeholder="Escribe la edad"
            style={styles.inputPaper}
            outlineColor="#b38900ff"
            activeOutlineColor="#b38900ff"
            keyboardType="numeric"
            value={age}
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-9]/g, '');
              setEdad(numericText);
            }} 
          />
        </View>

        <View style={styles.modulesContainer}>
          <Text style={styles.modulesTitle}>Módulos a Aprender</Text>

          <View style={styles.checkboxRow}>
            <Text style={styles.checkboxLabel}>Español</Text>
            <Checkbox
              status={checkedEsp ? 'checked' : 'unchecked'}
              onPress={() => setCheckedEsp(!checkedEsp)}
              color="#b38900ff" // Ajusté el color para que se vea (puedes revertirlo a #fff si prefieres)
            />
          </View>

          <View style={styles.checkboxRow}>
            <Text style={styles.checkboxLabel}>Matemáticas</Text>
            <Checkbox
              status={checkedMat ? 'checked' : 'unchecked'}
              onPress={() => setCheckedMat(!checkedMat)}
              color="#b38900ff"
            />
          </View>
        </View>

        <PaperButton
          mode="contained"
          onPress={SendSon}
          style={styles.addButton}
          labelStyle={styles.addButtonText}
        >
          Agregar
        </PaperButton>

      </View>

      <SideMenu ref={menuRef} />
    </SafeAreaView>
  );
}