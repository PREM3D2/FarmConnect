import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Dimensions, ScrollView, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Yup from 'yup';
import { Formik } from 'formik';
import LandService from '../../../services/LandService';
import AppTextInput from '../../../components/AppTextInput';
import AppDropdown from '../../../components/AppDropdown';
import { useNavigation, useRoute } from '@react-navigation/core';
import { Project } from '../ProjectListScreen';
import CropService from '../../../services/CropService';
import DateControl from '../../../components/DateControl';
import { Plot } from './Land';


const CropCultivaionTypeOptions = [
    { label: 'Sowing', value: 'sowing' },
    { label: 'Plantation', value: 'plantation' },
];

type Soil = {
    code: 1,
    soilColor: string,
    soilDesc: string
}

type CropOption = {
    code: 1,
    cropName: string,
    cropDesc: string
}

const plantationOptions = [
    { label: 'Zigzag', value: 'zigzag' },
    { label: 'Parallel', value: 'parallel' },
    { label: 'Single-line', value: 'single-line' },
];

const cropTypeDropdown = [
    { label: 'Main', value: 'main' },
    { label: 'Protection', value: 'protection' },
    { label: 'Border', value: 'border' },
];

type CropDetail = {
    code: number;
    projectId: number;
    projectName: string;
    plotId: number;
    plotName: string;
    cropId: number;
    cropName: string;
    cropType: string;
    cropCultivationType: string;
    plantationNurseryRaised: boolean;
    plantationNurseryRaisedDate: string;
    seedCompanyName: string;
    seedCompanyVarietyNumber: string;
    seedCompanyLogoImageAvailable: boolean;
    seedCompanyLogoImage: string | null;
    irrigationDrip: boolean;
    irrigationSprinker: boolean;
    irrigationFlood: boolean;
    bed: boolean;
    bedCount: string;
    plantationMethod: string;
    stackingStatus: boolean;
    stackingDate: string;
    cultivationStatus: boolean;
    cultivationExpectedDate: string;
    cultivationActualDate: string;
    harvestStartStatus: boolean;
    harvestStartExpectedDate: string;
    harvestStartActualDate: string;
    harvestYieldKilosExpected: number | null;
    harvestIntervalCountExpected: number;
    harvestEndStatus: boolean;
    harvestEndExpectedDate: string;
    harvestEndActualDate: string;
    harvestDoneCount: number;
    harvestYieldKilosCollected: number | null;
    uprootingStatus: boolean;
    uprootingExpectedDate: string;
    uprootingActualDate: string;
    protectionsRequired: boolean;
    protectionsRequiredCount: number;
    protectionsDeployedCount: number;
};

const CropList = ({ }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const route = useRoute();
    const { project } = (route.params as { project: Project });
    const [editLand, setEditLand] = useState<CropDetail | null>(null);
    const [crops, setCrops] = useState<CropDetail[]>([]);
    const [reloadList, setReloadList] = useState(false);
    const [cropOptions, setCropOptions] = useState<CropOption[]>([]);
    const [landOptions, setLandOptions] = useState<Plot[]>([]);
    const [expandedItemCode, setExpandedItemCode] = useState<number | null>(null);
    const navigation = useNavigation();

    const openAddModal = () => {
        setEditLand(null);
        setModalVisible(true);
    };

    const openEditModal = (land: any) => {
        setEditLand(land);
        setModalVisible(true);
    };

    const handleAddPlot = async (values: any) => {
        const plotData = {
            projectId: project?.projectId,
            plotName: values.plotName,
            plotLength: parseFloat(values.plotLength),
            plotWidth: parseFloat(values.plotWidth),
            isRiser: values.isRiser,
            riserCalMethod: values.riserSide,
            plotRiserDistance: parseFloat(values.plotRiserDistance),
            plotBedActualCount: parseInt(values.plotBedActualCount, 10),
            soilId: values.soilId,
        };
        const addPlot = async () => {
            try {
                await LandService.addPlot(plotData);
            } catch (error) {
            }
        };
        addPlot();
        setReloadList(!reloadList);
    }

    const handleUpdatePlot = async (values: any) => {
        const plotData = {
            projectId: project?.projectId,
            plotName: values.plotName,
            plotLength: parseFloat(values.plotLength),
            plotWidth: parseFloat(values.plotWidth),
            isRiser: values.isRiser,
            riserCalMethod: values.riserSide,
            plotRiserDistance: parseFloat(values.plotRiserDistance),
            plotBedActualCount: parseInt(values.plotBedActualCount, 10),
            soilId: values.soilId,
            code: values.code,
        };
        const updatePlot = async () => {
            try {
                await LandService.updatePlot(plotData);
            } catch (error) {
            }
        };
        updatePlot();
        setReloadList(!reloadList);
    }

    useEffect(() => {
        const fetchLandOptions = async () => {
            try {
                const response = await LandService.getplotsbyprojectid(project.projectId);
                setLandOptions([...response.result || []]);
            } catch (error) {
                console.error("Error fetching soil data:", error);
            }
        };
        const fetchCropOptions = async () => {
            try {
                const response = await CropService.getallCropOptions();
                setCropOptions([...response.result || []]);
            } catch (error) {
                console.error("Error fetching soil data:", error);
            }
        };
        fetchCropOptions();
        fetchLandOptions();
    }, []);

    useEffect(() => {
        console.log("Project ID:", project);
        const fetchCrops = async () => {
            if (typeof project?.projectId !== 'number') return;
            try {
                const response = await CropService.getcropsbyprojectid(project.projectId);
                setCrops(response.result || []);
            } catch (error) {
            }
        };
        fetchCrops();
    }, [reloadList]);

    const validationSchema = Yup.object().shape({
        // projectId: Yup.number().required('Project ID is required'),
        plotId: Yup.string().required('Land Name is required'),
        cropId: Yup.string().required('Crop Name is required'),
        cropType: Yup.string().oneOf(['main', 'protection', 'border']).required('Crop type is required'),
        cropCultivationType: Yup.string().oneOf(['sowing', 'plantation']).required('Cultivation type is required'),
        plantationNurseryRaised: Yup.boolean().nullable(),
        plantationNurseryRaisedDate: Yup.string().required('Nursery Raised Date is required'),
        seedCompanyName: Yup.string().max(100).required('Plantation company name is required'),
        seedCompanyVarietyNumber: Yup.string().max(50).required('Plantation Variety number is required'),
        irrigationDrip: Yup.boolean().nullable(),
        irrigationSprinker: Yup.boolean().nullable(),
        irrigationFlood: Yup.boolean().nullable(),
        bed: Yup.boolean().nullable(),
        bedCount: Yup.number().typeError("Bed Count must be a number").required('Bed count is required'),
        plantationMethod: Yup.string().required('Plantation method is required'),
    })

    const toggleAccordion = (code: number) => {
        setExpandedItemCode(prev => (prev === code ? null : code));
    };

    const getListItems = (item: CropDetail) => {
        const irrigationTypes = [];
        if (item.irrigationDrip) irrigationTypes.push('Drip')
        if (item.irrigationSprinker) irrigationTypes.push('Sprinkler')
        if (item.irrigationFlood) irrigationTypes.push('Flood')
        let listItems = [

            { label: 'Company', value: item.seedCompanyName },
            { label: 'Variety', value: item.seedCompanyVarietyNumber },
        ]

        if (item.bed) {
            listItems.push({ label: 'Bed Count', value: item.bedCount });
        }
        if (item.plantationNurseryRaised) {
            listItems.push({ label: 'Nursery Raised', value: item.plantationNurseryRaisedDate });
        }
        listItems.push({ label: 'Irrigation', value: irrigationTypes.join(', ') });
        if (item.stackingStatus) {
            listItems.push({ label: 'Stacking', value: item.stackingDate });
        }
        if (item.protectionsRequired) {
            listItems.push({ label: 'Protections', value: `Required-${item.protectionsRequiredCount} | Deployed-${item.protectionsDeployedCount}` });
        }
        if (item.cultivationStatus) {
            listItems.push({ label: 'Cultivation', value: `Expected-${item.cultivationExpectedDate} | Actual-${item.cultivationActualDate}` });
        }
        if (item.harvestStartStatus) {
            listItems.push({ label: 'Harvest Start', value: `Expected-${item.harvestStartExpectedDate} | Actual-${item.harvestStartActualDate}` });
        }
        //To-do: Add Harvest Yield Expected and Interval Count
        if (item.harvestStartActualDate !== null && item.harvestStartActualDate !== '') {
            listItems.push({ label: 'Yield Interval', value: `Expected-${item.harvestIntervalCountExpected} | Actual-${item.harvestYieldKilosCollected}` });
            listItems.push({ label: 'Harvest End', value: `Expected-${item.harvestEndExpectedDate} | Actual-${item.harvestEndActualDate}` });
        }
        return listItems
    }

    const renderLand = ({ item }: { item: CropDetail }) => (
        <TouchableOpacity style={styles.card} onPress={() => (navigation as any).navigate("CropScreen")}>
            <View style={styles.cardHeader}>
                <Text style={styles.landName}>{item.cropName}</Text>
                <View style={styles.cardActions}>
                    <TouchableOpacity onPress={() => openEditModal(item)}>
                        <Icon name="pencil" size={22} color="#388e3c" />
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={styles.field}>
                <Text style={styles.fieldLabel}>Land Name: </Text>
                <Text style={styles.fieldValue}>{item.plotName}</Text>
            </Text>

            <Text style={styles.field}>
                <Text style={styles.fieldLabel}>Cultivation Type: </Text>
                <Text style={styles.fieldValue}>{item.cropCultivationType}</Text>
            </Text>
            <Text style={styles.field}>
                <Text style={styles.fieldLabel}>Crop Type: </Text>
                <Text style={styles.fieldValue}>{item.cropType}</Text>
            </Text>
            <Text style={styles.field}>
                <Text style={styles.fieldLabel}>Plantation Method: </Text>
                <Text style={styles.fieldValue}>{item.plantationMethod}</Text>
            </Text>

            {/* Accordion Toggle */}
            <View style={{ alignItems: 'flex-end', marginTop: 8 }}>
                <TouchableOpacity onPress={() => toggleAccordion(item.code)}>
                    <Text style={styles.accordionToggle}>
                        {expandedItemCode === item.code ? 'Minimize ▲' : 'Expand ▼'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Accordion Content */}
            {expandedItemCode === item.code && (
                <View style={styles.accordionContent}>
                    {getListItems(item).map(({ label, value }, index) => (
                        <Text key={index} style={styles.field}>
                            <Text style={styles.fieldLabel}>{label}: </Text>
                            <Text style={styles.fieldValue}>{value}</Text>
                        </Text>
                    ))}
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <MaterialCommunityIcons name="arrow-left" size={22} color='#388e3c' />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Crops</Text>
            </View>
            <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
                <Icon name="plus-circle" size={24} color='#388e3c' />
                <Text style={styles.addBtnText}>Add Crop</Text>
            </TouchableOpacity>
            <FlatList
                data={crops}
                renderItem={renderLand}
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
                        <Text style={styles.modalTitle}>{editLand ? 'Edit CropList' : 'Add CropList'}</Text>
                        <Formik
                            initialValues={{
                                projectId: project?.projectId || '',
                                plotId: editLand?.plotId || '',
                                cropId: editLand?.cropId || '',
                                cropType: editLand?.cropType || '',
                                cropCultivationType: editLand?.cropCultivationType || '',
                                plantationNurseryRaised: editLand?.plantationNurseryRaised || false,
                                plantationNurseryRaisedDate: editLand?.plantationNurseryRaisedDate || '',
                                seedCompanyName: editLand?.seedCompanyName || '',
                                seedCompanyVarietyNumber: editLand?.seedCompanyVarietyNumber || '',
                                irrigationDrip: editLand?.irrigationDrip || false,
                                irrigationSprinker: editLand?.irrigationSprinker || false,
                                irrigationFlood: editLand?.irrigationFlood || false,
                                bed: editLand?.bed || false,
                                bedCount: editLand?.bedCount || '',
                                plantationMethod: editLand?.plantationMethod || '',
                            }}
                            validationSchema={validationSchema}
                            onSubmit={(values, { resetForm }) => {
                                if (!editLand) {
                                    handleAddPlot(values);
                                }
                                else {
                                    handleUpdatePlot(values);
                                }
                                setModalVisible(false);
                                resetForm();
                            }}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                                <>
                                    <ScrollView contentContainerStyle={{ paddingBottom: 24, marginTop: 10 }} showsVerticalScrollIndicator={false}>
                                        {/* <Text>{JSON.stringify(errors, null, 2)} </Text> */}
                                        <AppDropdown
                                            required={true}
                                            data={landOptions.map(land => ({ label: land.plotName, value: land.code }))}
                                            labelField="label"
                                            valueField="value"
                                            value={values.plotId}
                                            error={touched.plotId && errors.plotId ? errors.plotId : ''}
                                            onChange={item => setFieldValue('plotId', item.value)}
                                            placeholder="Plot" />
                                        <AppDropdown
                                            required={true}
                                            data={cropOptions.map(crop => ({ label: crop.cropName, value: crop.code }))}
                                            labelField="label"
                                            valueField="value"
                                            value={values.cropId}
                                            error={touched.cropId && errors.cropId ? errors.cropId : ''}
                                            onChange={item => setFieldValue('cropId', item.value)}
                                            placeholder="Crop" />
                                        <AppDropdown
                                            required={true}
                                            data={cropTypeDropdown}
                                            labelField="label"
                                            valueField="value"
                                            value={values.cropType}
                                            error={touched.cropType && errors.cropType ? errors.cropType : ''}
                                            onChange={item => setFieldValue('cropType', item.value)}
                                            placeholder="Crop Type" />
                                        <AppDropdown
                                            required={true}
                                            data={CropCultivaionTypeOptions}
                                            labelField="label"
                                            valueField="value"
                                            value={values.cropCultivationType}
                                            error={touched.cropCultivationType && errors.cropCultivationType ? errors.cropCultivationType : ''}
                                            onChange={item => setFieldValue('cropCultivationType', item.value)}
                                            placeholder="Cultivation Type" />
                                        <View style={styles.checkboxRow}>
                                            <TouchableOpacity
                                                style={styles.checkbox}
                                                onPress={() => setFieldValue('isRiser', !values.plantationNurseryRaised)}
                                            >
                                                <MaterialCommunityIcons
                                                    name={values.plantationNurseryRaised ? 'checkbox-marked' : 'checkbox-blank-outline'}
                                                    size={22}
                                                    color="#388e3c"
                                                />
                                            </TouchableOpacity>
                                            <Text style={styles.checkboxLabel}>Nursery Raised</Text>
                                        </View>
                                        <View style={styles.dropdownRow}>
                                            <DateControl
                                                value={values.plantationNurseryRaisedDate}
                                                setFieldValue={setFieldValue}
                                                name="plantationNurseryRaisedDate"
                                                error={touched.plantationNurseryRaisedDate && errors.plantationNurseryRaisedDate ? errors.plantationNurseryRaisedDate : ''}
                                                touched={touched.plantationNurseryRaisedDate}
                                                placeholder="Nursery Raised Date"
                                                required={true}
                                            />
                                        </View>
                                        <AppTextInput
                                            placeholder="Planting Crop Company"
                                            maxLength={45}
                                            onBlur={handleBlur('seedCompanyName')}
                                            value={values.seedCompanyName}
                                            required={true}
                                            error={touched.seedCompanyName && errors.seedCompanyName ? errors.seedCompanyName : ''}
                                            onChangeText={handleChange('seedCompanyName')} />
                                        <AppTextInput
                                            placeholder="Planting Crop Variety"
                                            onBlur={handleBlur('seedCompanyVarietyNumber')}
                                            keyboardType="decimal-pad"
                                            value={values.seedCompanyVarietyNumber}
                                            required={true}
                                            error={touched.seedCompanyVarietyNumber && errors.seedCompanyVarietyNumber ? errors.seedCompanyVarietyNumber : ''}
                                            onChangeText={handleChange('seedCompanyVarietyNumber')} />
                                        <View style={styles.checkboxRow}>
                                            <Text style={styles.checkboxLabel}>Irrigation:</Text>
                                            <TouchableOpacity
                                                style={styles.checkbox}
                                                onPress={() => setFieldValue('irrigationDrip', !values.irrigationDrip)}
                                            >
                                                <MaterialCommunityIcons
                                                    name={values.irrigationDrip ? 'checkbox-marked' : 'checkbox-blank-outline'}
                                                    size={22}
                                                    color="#388e3c"
                                                />
                                            </TouchableOpacity>
                                            <Text style={styles.checkboxLabel}>Drip</Text>
                                            <TouchableOpacity
                                                style={styles.checkbox}
                                                onPress={() => setFieldValue('irrigationSprinker', !values.irrigationSprinker)}
                                            >
                                                <MaterialCommunityIcons
                                                    name={values.irrigationSprinker ? 'checkbox-marked' : 'checkbox-blank-outline'}
                                                    size={22}
                                                    color="#388e3c"
                                                />
                                            </TouchableOpacity>
                                            <Text style={styles.checkboxLabel}>Sprinkler</Text>
                                            <TouchableOpacity
                                                style={styles.checkbox}
                                                onPress={() => setFieldValue('irrigationFlood', !values.irrigationFlood)}
                                            >
                                                <MaterialCommunityIcons
                                                    name={values.irrigationFlood ? 'checkbox-marked' : 'checkbox-blank-outline'}
                                                    size={22}
                                                    color="#388e3c"
                                                />
                                            </TouchableOpacity>
                                            <Text style={styles.checkboxLabel}>Flood</Text>
                                        </View>
                                        <View style={styles.checkboxRow}>
                                            <TouchableOpacity
                                                style={styles.checkbox}
                                                onPress={() => setFieldValue('bed', !values.bed)}
                                            >
                                                <MaterialCommunityIcons
                                                    name={values.bed ? 'checkbox-marked' : 'checkbox-blank-outline'}
                                                    size={22}
                                                    color="#388e3c"
                                                />
                                            </TouchableOpacity>
                                            <Text style={styles.checkboxLabel}>Bed</Text>
                                        </View>
                                        <AppDropdown
                                            required={true}
                                            data={plantationOptions}
                                            labelField="label"
                                            valueField="value"
                                            value={values.plantationMethod}
                                            error={touched.plantationMethod && errors.plantationMethod ? errors.plantationMethod : ''}
                                            onChange={item => setFieldValue('plantationMethod', item.value)}
                                            placeholder="Plantation" />
                                    </ScrollView>
                                    <View style={styles.modalActions}>
                                        <TouchableOpacity style={styles.saveBtn} onPress={() => handleSubmit()}>
                                            <Text style={styles.saveBtnText}>Save</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.cancelBtn} onPress={() => {
                                            setModalVisible(false);
                                        }}>
                                            <Text style={styles.cancelBtnText}>Cancel</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}
                        </Formik>
                    </View>
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
    backText: {
        color: '#388e3c',
        fontWeight: 'bold',
        fontSize: 16,
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
    landName: {
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
        fontWeight: 'bold'
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
        maxHeight: Dimensions.get('window').height * 0.85,
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
        marginRight: 10
    },
    checkbox: {
        marginRight: 4,
    },
    checkboxLabel: {
        fontSize: 16,
        color: '#333',
        marginRight: 12
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
    fieldLabel: {
        fontWeight: 'bold',
        color: '#333',
    },
    fieldValue: {
        color: '#555',
    },
    accordionToggle: {
        color: '#388e3c',
        fontWeight: 'bold',
        marginTop: 8,
        marginBottom: 4,
    },
    accordionContent: {
        backgroundColor: '#f1f8e9',
        padding: 10,
        borderRadius: 8,
        marginTop: 8,
    },
});

export default CropList;
