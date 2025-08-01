import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Dimensions, ScrollView, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Yup from 'yup';
import { Formik } from 'formik';
import PumpsService from '../../../services/PumpsService';
import AppTextInput from '../../../components/AppTextInput';
import { useNavigation, useRoute } from '@react-navigation/core';
import { Project, ProjectStackParamList } from '../ProjectListScreen';
import AppDropdown from '../../../components/AppDropdown';
import { ActivityIndicator, PaperProvider } from 'react-native-paper';
import TagCompoent from '../../../components/TagComponent';
import VenturiService from '../../../services/VenturiService';
import { Venturi } from './Venturi';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { showToast } from '../../../components/ShowToast';


const phaseDropdown = [
    { label: 'SinglePhase', value: 'single' },
    { label: 'ThreePhase', value: 'three' },
];

const pumpWaterOutputDropdown = [
    { label: 'LPM', value: 'LPM' },
    { label: 'LPH', value: 'LPH' },
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

const Pumps = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [editPumps, setEditPumps] = useState<Pump | null>(null);
    const [pumps, setPumps] = useState<Pump[]>([]);
    const [venturis, setVenturis] = useState<Venturi[]>([]);
    const route = useRoute();
    const { project } = (route.params as { project: Project });
    const [reloadList, setReloadList] = useState(false);
    const [isEditCase, setIsEditCase] = useState(false);
    const [isMapVenturi, setIsMapVenturi] = useState(false);
    const [selectedVenturies, setSelectedVenturies] = useState<any>([])
    const navigation = useNavigation<NativeStackNavigationProp<ProjectStackParamList>>();
    // const [selectedLinkedPump, setSelectedLinkedPump  ] = useState<Pump | null>(null);

    const openAddModal = () => {
        setIsMapVenturi(false);
        setIsEditCase(false);
        setEditPumps(null);
        setModalVisible(true);
    };

    const openEditModal = (Pumps: any) => {
        setEditPumps(Pumps);
        setModalVisible(true);
    };

    const handleDelete = async (Pump: Pump) => {
        const deletePump = async () => {
            try {
                const response = await PumpsService.deletePump(Pump.code);
                showToast('success', 'Delete Pump', 'Pump has been Deleted Successfully');
                setReloadList(!reloadList);
            } catch (error) {
                 showToast('error', 'Delete Pumo', 'Error while Delteing Pump');
            }
        };
        await deletePump();
    };

    const confirmDelete = (Pump: Pump) => {
        Alert.alert(
            'Delete Pump',
            `Do you want to Delete the Pump ${Pump.pumpName}?`,
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

    const getPumpDetailbyPumpId = (item: any) => {
        const getPumpCodes = async () => {
            try {
                const response = await PumpsService.getPumpbyPumpid(item.code);
                const venturies = response.venturiCodes.map((item: any) => { return item.toString() })
                setSelectedVenturies([...venturies])
                setIsEditCase(false);
                setIsMapVenturi(true);
                openEditModal(item);
            }
            catch (error) {
            }
        }
        getPumpCodes();
    }

    const handleAddPump = async (values: any) => {
        const PumpData = {
            projectId: project?.projectId,
            pumpName: values.pumpName,
            pumpHorsePower: parseFloat(values.pumpHorsePower),
            pumpWaterOutputUnit: parseFloat(values.pumpWaterOutputUnit),
            pumpWaterOutput: values.pumpWaterOutput,
            pumpElectricPhase: values.pumpElectricPhase,
        };
        const addPump = async () => {
            try {
                const response = await PumpsService.addPump(PumpData);
                const toastType = response.result.success ? 'success' : 'error'
                if (response.result.success) {
                    setReloadList(!reloadList);
                    showToast(toastType, "Add Pump", response.result.successMessage);
                }
                else {
                    showToast(toastType, "Add Pump", response.result.errorMessage);
                }
            } catch (error) {
            }
        };
        await addPump();
    }

    const handleUpdatePump = async (values: any) => {
        const PumpData = {
            projectId: project?.projectId,
            pumpName: values.pumpName,
            pumpHorsePower: parseFloat(values.pumpHorsePower),
            pumpWaterOutputUnit: values.pumpWaterOutputUnit,
            pumpWaterOutput: values.pumpWaterOutput,
            pumpElectricPhase: values.pumpElectricPhase,
            code: editPumps?.code,
        };
        const updatePumpData = async () => {
            try {
                const response = await PumpsService.updatePump(PumpData);
                const toastType = response.result.success ? 'success' : 'error'
                if (response.result.success) {
                    setReloadList(!reloadList);
                    showToast(toastType, "Edit Pump", response.result.successMessage);
                }
                else {
                    showToast(toastType, "Edit Pump", response.result.errorMessage);
                }
            } catch (error) {
            }
        };
        await updatePumpData();
    }

    useEffect(() => {
        const fetchVentuies = async () => {
            if (typeof project?.projectId !== 'number') return;
            try {
                const response = await VenturiService.getventurisbyprojectid(project.projectId);
                setVenturis(response.result || []);
            } catch (error) {
            }
        };
        fetchVentuies();
    }, []);

    useEffect(() => {
        setIsLoading(true);
        const fetchPumps = async () => {
            if (typeof project?.projectId !== 'number') return;
            try {
                const response = await PumpsService.getPumpsbyprojectid(project.projectId);
                setPumps(response.result || []);
                setIsLoading(false);
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
                        setIsMapVenturi(false)
                        openEditModal(item);
                        setIsEditCase(true);
                    }}>
                        <Icon name="pencil" size={22} color="#388e3c" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginLeft: 8 }} onPress={() => confirmDelete(item)}>
                        <MaterialCommunityIcons name="delete" size={22} color="#900" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginLeft: 8 }} onPress={() => {
                        getPumpDetailbyPumpId(item);
                    }}>
                        <MaterialCommunityIcons name="link" size={26} color="#388e3c" />
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.field}>Power: {item.pumpHorsePower}</Text>
            <Text style={styles.field}>Output: {item.pumpWaterOutput}</Text>
            <Text style={styles.field}>Phase: {item.pumpElectricPhase}</Text>
            <Text style={styles.field}>Venturies: {item.venturiCount}</Text>
        </View>
    );

    const handleSelectedTags = async (selectedTags: any) => {
        const requestBody = {
            code: editPumps?.code,
            venturiCodes: selectedTags.map((tag: string) => { return Number(tag) })
        }
        const mapVenturistoPump = async () => {
            try {
                const response = await PumpsService.mapVenturiesToPump(requestBody);
                const toastType = response.result.success ? 'success' : 'error'
                if (response.result.success) {
                    setReloadList(!reloadList);
                    showToast(toastType, "Map Venturi to Pump", response.result.successMessage);
                }
                else {
                    showToast(toastType, "Map Venturi to Pump", response.result.errorMessage);
                }
            } catch (error) {
            }
        };
        await mapVenturistoPump();
        setModalVisible(false);
        setIsEditCase(false);
    }

    return (
        <View style={{ flex: 1 }}>
            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#388e3c" />
                </View>
            )}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('ProjectListScreen')} style={styles.backBtn}>
                    <MaterialCommunityIcons name="arrow-left" size={22} color='#388e3c' />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{project.projectName}</Text>
            </View>
            <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
                <Icon name="plus-circle" size={24} color='#388e3c' />
                <Text style={styles.addBtnText}>Add Pump</Text>
            </TouchableOpacity>
            <FlatList
                data={pumps}
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
                    <View></View>
                    {isMapVenturi ? (
                        <View style={styles.modalContent}>
                            <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
                                <PaperProvider>
                                    <TagCompoent label='Venturi' data={venturis.map((vent) => { return { code: vent.code.toString(), label: vent.venturiName } })} handleSubmit={handleSelectedTags} existingTags={selectedVenturies} handleCancel={() => setModalVisible(false)} />
                                </PaperProvider>
                            </ScrollView>
                        </View>)
                        :
                        (
                            <View style={styles.modalContent}>
                                <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
                                    <Text style={styles.modalTitle}>{editPumps ? 'Edit Pump' : 'Add Pump'}</Text>
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
                                                    onBlur={handleBlur('pumpName')}
                                                    value={values.pumpName}
                                                    required={true}
                                                    error={touched.pumpName && errors.pumpName ? errors.pumpName : ''}
                                                    onChangeText={handleChange('pumpName')} />
                                                <AppTextInput
                                                    placeholder="HorsePower"
                                                    onBlur={handleBlur('pumpHorsePower')}
                                                    keyboardType="decimal-pad"
                                                    value={values.pumpHorsePower}
                                                    required={true}
                                                    error={touched.pumpHorsePower && errors.pumpHorsePower ? errors.pumpHorsePower : ''}
                                                    onChangeText={handleChange('pumpHorsePower')} />
                                                <AppDropdown
                                                    required={true}
                                                    data={phaseDropdown}
                                                    labelField="label"
                                                    valueField="value"
                                                    value={values.pumpElectricPhase}
                                                    error={touched.pumpElectricPhase && errors.pumpElectricPhase ? errors.pumpElectricPhase : ''}
                                                    onChange={item => setFieldValue('pumpElectricPhase', item.value)}
                                                    placeholder="Electric Phase"
                                                />
                                                <AppTextInput
                                                    placeholder="Water Output"
                                                    onBlur={handleBlur('pumpWaterOutput')}
                                                    keyboardType="decimal-pad"
                                                    value={values.pumpWaterOutput}
                                                    required={true}
                                                    error={touched.pumpWaterOutput && errors.pumpWaterOutput ? errors.pumpWaterOutput : ''}
                                                    onChangeText={handleChange('pumpWaterOutput')} />
                                                <AppDropdown
                                                    required={true}
                                                    data={pumpWaterOutputDropdown}
                                                    labelField="label"
                                                    valueField="value"
                                                    value={values.pumpWaterOutputUnit}
                                                    error={touched.pumpWaterOutputUnit && errors.pumpWaterOutputUnit ? errors.pumpWaterOutputUnit : ''}
                                                    onChange={item => setFieldValue('pumpWaterOutputUnit', item.value)}
                                                    placeholder="Water Output Unit"
                                                />
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
                        )
                    }
                </View>
            </Modal>

        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 16,
        paddingBottom: 8,
        paddingHorizontal: 16,
        backgroundColor: '#f7faff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backBtn: {
        padding: 4,
        marginRight: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
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
    modalTagContent: {
        backgroundColor: '#fff',
        borderRadius: 18,
        paddingVertical: 24,
        paddingHorizontal: 18,
        width: Dimensions.get('window').width * 0.95,
        minHeight: Dimensions.get('window').height * 0.30,
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
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
});

export default Pumps;
