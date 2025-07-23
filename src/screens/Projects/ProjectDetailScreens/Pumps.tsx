import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Dimensions, ScrollView, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dropdown } from 'react-native-element-dropdown';
import * as Yup from 'yup';
import { Formik } from 'formik';
import PumpsService from '../../../services/PumpsService';
import AppTextInput from '../../../components/AppTextInput';
import { useRoute } from '@react-navigation/core';
import { Project } from '../ProjectListScreen';


const phaseDropdown = [
    { label: 'SinglePhase', value: 'single' },
    { label: 'ThreePhase', value: 'three' },
];
//need to update soilColor dropdown from API
const pumpWaterOutputDropdown = [
    { label: 'LPM', value: "LPM" },
    { label: 'LPH', value:'LPH' },
    { label: 'LPS', value: 'LPS' },
    { label: 'GPM', value: 'GPM' },
];

type Pump = {
  code: number;
  projectId: number;
  projectName: string;
  pumpName: string;
  pumpHorsePower: number;
  pumpWaterOutputUnit: string;
  pumpWaterOutput: number;
  pumpElectricPhase: 'single' | 'three'; 
  venturiCount: number;
  venturiCodes: string[] | null;
};

const Pumps = () => 
    {
    const [modalVisible, setModalVisible] = useState(false);
    const [editPumps, setEditPumps] = useState<Pump | null>(null);
    const [Pumps, setPumps] = useState<Pump[]>([]);
    const route = useRoute();
    const { project } = (route.params as { project: Project });
    const [reloadList, setReloadList] = useState(false);
    const [isEditCase, setIsEditCase] = useState(false);

    const openAddModal = () => {
        setEditPumps(null);
        setModalVisible(true);
    };


    const openEditModal = (Pumps: any) => {
        setEditPumps(Pumps);
        setModalVisible(true);
    };

    const handleDelete = (Pump: Pump) => {
        const deletePump = async () => {
            try {
                const response = await PumpsService.deletePump(Pump.code);
            } catch (error) {
            }
        };
        deletePump();
        setReloadList(!reloadList);
    };

    const confirmDelete = (Pump: Pump) => {
        Alert.alert(
            'Delete Pumps',
            `Do you want to Delete the Pumps ${Pump.pumpName}?`,
            [
                {
                    text: 'No',
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: () => handleDelete(Pump),
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

    const handleAddPump = async (values: any) => {
        const PumpData = {
            projectId: project?.projectId,
            PumpName: values.PumpName,
            PumpLength: parseFloat(values.PumpLength),
            PumpWidth: parseFloat(values.PumpWidth),
            isRiser: values.isRiser,
            riserCalMethod: values.riserSide,
            PumpRiserDistance: parseFloat(values.PumpRiserDistance),
            PumpBedActualCount: parseInt(values.PumpBedActualCount, 10),
            soilId: values.soilId,
        };
        const addPump = async () => {
            try {
               const res =  await PumpsService.addPump(PumpData);
                console.log('Pump added successfully', res);
            } catch (error) {
              console.error('Error adding pump:', error);
            }
        };
        addPump();
        setReloadList(!reloadList);
    }

    const handleUpdatePump = async (values: any) => {
        const PumpData = {
            projectId: project?.projectId,
            PumpName: values.PumpName,
            PumpLength: parseFloat(values.PumpLength),
            PumpWidth: parseFloat(values.PumpWidth),
            isRiser: values.isRiser,
            riserCalMethod: values.riserSide,
            PumpRiserDistance: parseFloat(values.PumpRiserDistance),
            PumpBedActualCount: parseInt(values.PumpBedActualCount, 10),
            soilId: values.soilId,
            code: values.code,
        };
        const updatePump = async () => {
            try {
                await PumpsService.updatePump(PumpData);
                setIsEditCase(false)
            } catch (error) {
            }
        };
        updatePump();

        setReloadList(!reloadList);
    }

    useEffect(() => {
        const fetchPumps = async () => {
            if (typeof project?.projectId !== 'number') return;
            try {
                const response = await PumpsService.getPumpsbyprojectid(project.projectId);
                setPumps(response.result || []);
            } catch (error) {
            }
        };
        fetchPumps();
    }, [reloadList]);

    const validationSchema = Yup.object().shape({
      pumpName: Yup.string().max(100).required('Pump name is required'),
      pumpHorsePower: Yup.number().typeError('Horse power must be a number').required('Horse power is required'),
      pumpWaterOutputUnit: Yup.string().max(10).required('Water output unit is required'),
      pumpWaterOutput: Yup.number().typeError('Water output must be a number').required('Water output is required'),
      pumpElectricPhase: Yup.string()
        .oneOf(['single', 'three'], 'Phase must be single or three')
        .required('Electric phase is required'),
    });

    const renderPumps = ({ item }: { item: Pump }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.PumpsName}>{item.pumpName}</Text>
                <View style={styles.cardActions}>
                    <TouchableOpacity onPress={() => {
                        openEditModal(item);
                        setIsEditCase(true);
                    }}>
                        <Icon name="pencil" size={22} color="#388e3c" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginLeft: 8 }} onPress={() => confirmDelete(item)}>
                        <MaterialCommunityIcons name="delete" size={22} color="#900" />
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.field}>Power: {item.pumpHorsePower}</Text>
            <Text style={styles.field}>Output: {item.pumpWaterOutput}</Text>
            <Text style={styles.field}>Phase: {item.pumpElectricPhase}</Text>
            <Text style={styles.field}>Venturies: {item.venturiCodes}</Text>           
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
                <Icon name="plus-circle" size={24} color='#388e3c' />
                <Text style={styles.addBtnText}>Add Pumps</Text>
            </TouchableOpacity>
            <FlatList
                data={Pumps}
                renderItem={renderPumps}
                keyExtractor={item => item.code.toString()}
                contentContainerStyle={{ padding: 16 }}
            />
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
                            <Text style={styles.modalTitle}>{editPumps ? 'Edit Pumps' : 'Add Pumps'}</Text>
                            <Formik
                                initialValues={{
                                    pumpName: editPumps?.pumpName || '',
                                    pumpHorsePower: editPumps?.pumpHorsePower?.toString() || '',
                                    pumpElectricPhase: editPumps?.pumpElectricPhase?.toString() || '',                                    
                                    pumpWaterOutputUnit: editPumps?.pumpWaterOutputUnit?.toString() || '',
                                    pumpWaterOutput: editPumps?.pumpWaterOutput?.toString() || '',                                   
                                }}
                                validationSchema={validationSchema}
                                onSubmit={(values, { resetForm }) => {
                                    if (!isEditCase) {
                                        handleAddPump(values);
                                    }
                                    else {
                                        handleUpdatePump(values);
                                    }
                                    setModalVisible(false);
                                    resetForm();
                                }}
                            >
                                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                                    <>
                                        {/* <Text>{JSON.stringify(errors, null, 2)} </Text> */}
                                        <AppTextInput
                                            placeholder="Pump Name"
                                            maxLength={45}
                                            onBlur={() => handleBlur('pumpName')}
                                            value={values.pumpName}
                                            required={true}
                                            error={touched.pumpName && errors.pumpName ? errors.pumpName : ''}
                                            onChangeText={handleChange('pumpName')} />
                                        <AppTextInput
                                            placeholder="HorsePower"
                                            onBlur={() => handleBlur('pumpHorsePower')}
                                            keyboardType="decimal-pad"
                                            value={values.pumpHorsePower}
                                            required={true}
                                            error={touched.pumpHorsePower && errors.pumpHorsePower ? errors.pumpHorsePower : ''}
                                            onChangeText={handleChange('pumpHorsePower')} />
                                        <View style={styles.dropdownRow}>
                                            <Text style={styles.dropdownLabel}>Phase</Text>
                                            <Dropdown
                                                style={styles.dropdown}
                                                data={phaseDropdown}
                                                labelField="label"
                                                valueField="value"
                                                value={values.pumpElectricPhase}
                                                onChange={item => setFieldValue('pumpElectricPhase', item.value)}
                                                placeholder="Select Electric Phase"
                                            />
                                        </View>
                                        <AppTextInput
                                            placeholder="Water Output"
                                            onBlur={() => handleBlur('pumpWaterOutput')}
                                            keyboardType="decimal-pad"
                                            value={values.pumpWaterOutput}
                                            required={true}
                                            error={touched.pumpWaterOutput && errors.pumpWaterOutput ? errors.pumpWaterOutput : ''}
                                            onChangeText={handleChange('pumpWaterOutput')} />
                                        
                                        <View style={styles.dropdownRow}>
                                            <Text style={styles.dropdownLabel}>Output</Text>
                                            <Dropdown
                                                style={styles.dropdown}
                                                data={pumpWaterOutputDropdown}
                                                labelField="label"
                                                valueField="value"
                                                value={values.pumpWaterOutputUnit}
                                                onChange={item => setFieldValue('pumpWaterOutputUnit', item.value)}
                                                placeholder="Select Water Output Unit"
                                            />
                                        </View>
                                        {touched.pumpWaterOutputUnit && errors.pumpWaterOutputUnit && <Text style={styles.error}>{errors.pumpWaterOutputUnit}</Text>}
                                        <View style={styles.modalActions}>
                                            <TouchableOpacity style={styles.saveBtn} onPress={() => handleSubmit()}>
                                                <Text style={styles.saveBtnText}>Save</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.cancelBtn} onPress={() => {
                                                setModalVisible(false);
                                                setIsEditCase(false);
                                            }}>
                                                <Text style={styles.cancelBtnText}>Cancel</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                )}
                            </Formik>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: 10,
        margin: 16,
        borderRadius: 8,
        marginBottom: 0,
    },
    addBtnText: {
        marginLeft: 8,
        color: '#388e3c',
        fontWeight: 'bold',
        fontSize: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    PumpsName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#388e3c',
    },
    cardActions: {
        flexDirection: 'row',
    },
    field: {
        fontSize: 15,
        color: '#333',
        marginBottom: 2,
    },
    sectionRiser: {
        marginTop: 8,
        backgroundColor: '#f1f8e9',
        borderRadius: 6,
        padding: 8,
    },
    sectionTitle: {
        fontWeight: 'bold',
        color: '#388e3c',
        marginBottom: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 18,
        paddingVertical: 24,
        paddingHorizontal: 18,
        width: Dimensions.get('window').width * 0.95,
        maxHeight: Dimensions.get('window').height * 0.92,
        elevation: 6,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#388e3c',
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 10,
        marginBottom: 12,
        fontSize: 16,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    checkbox: {
        marginRight: 8,
    },
    checkboxLabel: {
        fontSize: 16,
        color: '#333',
    },
    dropdownRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    dropdownLabel: {
        fontSize: 16,
        color: '#333',
        marginRight: 8,
    },
    dropdown: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        paddingHorizontal: 10,
        height: 40,
        backgroundColor: '#fff',
    },
    error: {
        color: '#d32f2f',
        fontSize: 13,
        marginBottom: 8,
        marginLeft: 2,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    saveBtn: {
        backgroundColor: '#388e3c',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    saveBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    cancelBtn: {
        backgroundColor: '#eee',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    cancelBtnText: {
        color: '#333',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default Pumps;
