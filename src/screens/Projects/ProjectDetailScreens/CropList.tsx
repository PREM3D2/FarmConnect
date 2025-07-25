import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Dimensions, ScrollView, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dropdown } from 'react-native-element-dropdown';
import * as Yup from 'yup';
import { Formik } from 'formik';
import LandService from '../../../services/LandService';
import { useContext } from 'react';
import { ProjectDetailContext } from '../ProjectDetailScreen';
import AppTextInput from '../../../components/AppTextInput';
import AppDropdown from '../../../components/AppDropdown';
import { useNavigation, useRoute } from '@react-navigation/core';
import { Project } from '../ProjectListScreen';
import CropService from '../../../services/CropService';
import DateControl from '../../../components/DateControl';


const CropCultivaionTypeOptions = [
    { label: 'sowing', value: 'sowing' },
    { label: 'plantation', value: 'plantation' },
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

//need to update soilColor dropdown from API
const plantationOptions = [
    { label: 'zigzag', value: 'zigzag' },
    { label: 'parallel', value: 'parallel' },
    { label: 'single-line', value: 'single-line' },
];


type Plot = {
    code: number;
    projectId: number;
    projectName: string;
    plotName: string;
    plotLength: number;
    plotWidth: number;
    isRiser: boolean;
    riserCalMethod: string;
    plotRiserDistance: number;
    plotBedActualCount: number;
    soilId: number;
    soilColor: string;
    plotTotalArea: number;
    plotBedEstimateCount: number;
};

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
    const navigation = useNavigation();
    const openAddModal = () => {
        setEditLand(null);
        setModalVisible(true);
    };

    const cropTypeDropdown = [
        { label: 'main', value: 'main' },
        { label: 'protection', value: 'protection' },
        { label: 'border', value: 'border' },
    ];


    const openEditModal = (land: any) => {
        setEditLand(land);
        setModalVisible(true);
    };

    const handleDelete = (plot: Plot) => {
        const deletePlot = async () => {
            try {
                const response = await LandService.deletePlot(plot.code);
            } catch (error) {
            }
        };
        deletePlot();
        setReloadList(!reloadList);
    };

    const confirmDelete = (plot: Plot) => {
        Alert.alert(
            'Delete CropList',
            `Do you want to Delete the CropList ${plot.plotName}?`,
            [
                {
                    text: 'No',
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: () => handleDelete(plot),
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
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
        plotName: Yup.string().max(45).required('Name is required'),
        plotLength: Yup.number().typeError('Length must be a number').required('Length is required'),
        plotWidth: Yup.number().typeError('Width must be a number').required('Width is required'),
        isRiser: Yup.boolean().required(),
        plotRiserDistance: Yup.number().typeError('Riser Distance must be a number').required('Riser Distance is required'),
        plotBedActualCount: Yup.number().typeError('Bed Count must be a number').required('Bed Count is required'),
        riserSide: Yup.string().required('Riser Side is required'),
        soilId: Yup.string().required('soil type is required'),
    });

    const cropDetailSchema = Yup.object().shape({
        code: Yup.number().required('Code is required'),
        projectId: Yup.number().required('Project ID is required'),
        projectName: Yup.string().max(100).required('Project name is required'),
        plotId: Yup.number().required('Plot ID is required'),
        plotName: Yup.string().max(100).required('Plot name is required'),
        cropId: Yup.number().required('Crop ID is required'),
        cropName: Yup.string().max(100).required('Crop name is required'),
        cropType: Yup.string().oneOf(['main', 'intercrop']).required('Crop type is required'),
        cropCultivationType: Yup.string().oneOf(['plantation', 'direct-seeding']).required('Cultivation type is required'),
        plantationNurseryRaised: Yup.boolean().required(),
        plantationNurseryRaisedDate: Yup.string().nullable().required('Nursery date is required'),
        seedCompanyName: Yup.string().max(100).required('Seed company name is required'),
        seedCompanyVarietyNumber: Yup.string().max(50).required('Variety number is required'),
        seedCompanyLogoImageAvailable: Yup.boolean().required(),
        seedCompanyLogoImage: Yup.string().nullable(),
        irrigationDrip: Yup.boolean().required(),
        irrigationSprinker: Yup.boolean().required(),
        irrigationFlood: Yup.boolean().required(),
        bed: Yup.boolean().required(),
        bedCount: Yup.string().matches(/^\d+$/, 'Bed count must be a number').required('Bed count is required'),
        plantationMethod: Yup.string().oneOf(['single-line', 'double-line']).required('Plantation method is required'),
        stackingStatus: Yup.boolean().required(),
        stackingDate: Yup.string().nullable(),
        cultivationStatus: Yup.boolean().required(),
        cultivationExpectedDate: Yup.string().nullable(),
        cultivationActualDate: Yup.string().nullable(),
        harvestStartStatus: Yup.boolean().required(),
        harvestStartExpectedDate: Yup.string().nullable(),
        harvestStartActualDate: Yup.string().nullable(),
        harvestYieldKilosExpected: Yup.number().nullable(),
        harvestIntervalCountExpected: Yup.number().required(),
        harvestEndStatus: Yup.boolean().required(),
        harvestEndExpectedDate: Yup.string().nullable(),
        harvestEndActualDate: Yup.string().nullable(),
        harvestDoneCount: Yup.number().required(),
        harvestYieldKilosCollected: Yup.number().nullable(),
        uprootingStatus: Yup.boolean().required(),
        uprootingExpectedDate: Yup.string().nullable(),
        uprootingActualDate: Yup.string().nullable(),
        protectionsRequired: Yup.boolean().required(),
        protectionsRequiredCount: Yup.number().required(),
        protectionsDeployedCount: Yup.number().required(),
    });

    const [expandedItemCode, setExpandedItemCode] = useState<number | null>(null);

    const toggleAccordion = (code: number) => {
        setExpandedItemCode(prev => (prev === code ? null : code));
    };

    const getListItems = (item: CropDetail) => {
        let listItems = [

            { label: 'Company', value: item.seedCompanyName },
            { label: 'Variety', value: item.seedCompanyVarietyNumber },
            // item.bed ? { label: 'Bed Count', value: item.bedCount } : null,
            // { label: 'Nursery Raised', value: item.plantationNurseryRaised ? item.plantationNurseryRaisedDate : 'No' },
            // { label: 'Irrigation', value: item.irrigationDrip ? 'Yes' : 'No' },
            // { label: 'Irrigation - Sprinkler', value: item.irrigationSprinker ? 'Yes' : 'No' },
            // { label: 'Irrigation - Flood', value: item.irrigationFlood ? 'Yes' : 'No' },
            // { label: 'Stacking', value: item.stackingStatus ? item.stackingDate : 'No' },
            // { label: 'Protections', value: item.protectionsRequired ? `${item.protectionsRequiredCount} :${item.protectionsDeployedCount}` : 'No' },
            // // { label: 'Protections Required Count', value: item.protectionsRequiredCount },
            // // { label: 'Protections Deployed Count', value: item.protectionsDeployedCount },
            // { label: 'Cultivation', value: item.cultivationStatus ? `${item.cultivationExpectedDate} & ${item.cultivationActualDate}` : 'No' },
            // { label: 'Cultivation Actual', value: item.cultivationActualDate || 'N/A' },


            // { label: 'Nursery Date', value: item.plantationNurseryRaisedDate },

            // { label: 'Bed', value: item.bed ? 'Yes' : 'No' },



            // { label: 'Harvest Start Expected', value: item.harvestStartExpectedDate || 'N/A' },
            // { label: 'Harvest Start Actual', value: item.harvestStartActualDate || 'N/A' },
            // { label: 'Harvest Yield Expected', value: item.harvestYieldKilosExpected ?? 'N/A' },
            // { label: 'Harvest Interval Count', value: item.harvestIntervalCountExpected },
            // { label: 'Harvest End Expected', value: item.harvestEndExpectedDate || 'N/A' },
            // { label: 'Harvest Done Count', value: item.harvestDoneCount },
            // { label: 'Harvest Yield Collected', value: item.harvestYieldKilosCollected ?? 'N/A' },
            // { label: 'Uprooting Status', value: item.uprootingStatus ? 'Done' : 'Pending' },
            // { label: 'Uprooting Expected Date', value: item.uprootingExpectedDate || 'N/A' },
            // { label: 'Uprooting Actual Date', value: item.uprootingActualDate || 'N/A' },

        ]

        if (item.bed) {
            // listItems.splice(2, 0, { label: 'Bed Count', value: item.bedCount });
            listItems.push({ label: 'Bed Count', value: item.bedCount });
        }
        if (item.plantationNurseryRaised) {
            listItems.push({ label: 'Nursery Raised', value: item.plantationNurseryRaisedDate });
        }
        const irrigationTypes = [];
        if (item.irrigationDrip) irrigationTypes.push('Drip')
        if (item.irrigationSprinker) irrigationTypes.push('Sprinkler')
        if (item.irrigationFlood) irrigationTypes.push('Flood')
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
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.landName}>{item.cropName}</Text>
                <View style={styles.cardActions}>
                    <TouchableOpacity onPress={() => openEditModal(item)}>
                        <Icon name="pencil" size={22} color="#388e3c" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginLeft: 8 }} onPress={() => confirmDelete(item)}>
                        <MaterialCommunityIcons name="delete" size={22} color="#900" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Basic Info */}
            {/* <Text style={styles.field}>
                <Text style={styles.fieldLabel}>Crop Name: </Text>
                <Text style={styles.fieldValue}>{item.cropName}</Text>
            </Text> */}

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
                <Text style={styles.fieldLabel}>Plantation Method </Text>
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
        </View>

    );

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <MaterialCommunityIcons name="arrow-left" size={22} color='#388e3c' />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Lands</Text>
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
                        <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
                            <Text style={styles.modalTitle}>{editLand ? 'Edit CropList' : 'Add CropList'}</Text>
                            <Formik
                                initialValues={{
                                    plotName: editLand?.plotName || '',
                                    plotLength: editLand?.plotLength?.toString() || '',
                                    plotWidth: editLand?.plotWidth?.toString() || '',
                                    isRiser: editLand?.isRiser || false,
                                    plotRiserDistance: editLand?.plotRiserDistance?.toString() || '',
                                    plotBedActualCount: editLand?.plotBedActualCount?.toString() || '',
                                    soilId: editLand?.soilId || '',
                                    // riserSide: editLand?.riserCalMethod || riserSides[0].value,
                                    code: editLand?.code || '',
                                    plantationNurseryRaisedDate: editLand?.plantationNurseryRaisedDate || '',
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
                                        {/* <Text>{JSON.stringify(errors, null, 2)} </Text> */}
                                        <View style={styles.dropdownRow}>
                                            <Text style={styles.dropdownLabel}>Land</Text>
                                            <Dropdown
                                                style={styles.dropdown}
                                                data={landOptions.map(land => ({ label: land.plotName, value: land.code }))}
                                                labelField="label"
                                                valueField="value"
                                                value={values.plotName}
                                                onChange={item => setFieldValue('pumpElectricPhase', item.value)}
                                                placeholder="Select Electric Phase"
                                            />
                                        </View>
                                        <View style={styles.dropdownRow}>
                                            <Text style={styles.dropdownLabel}>Crop</Text>
                                            <Dropdown
                                                style={styles.dropdown}
                                                data={cropOptions.map(crop => ({ label: crop.cropName, value: crop.code }))}
                                                labelField="label"
                                                valueField="value"
                                                value={values.plotName}
                                                onChange={item => setFieldValue('pumpElectricPhase', item.value)}
                                                placeholder="Select Electric Phase"
                                            />
                                        </View>
                                        <View style={styles.dropdownRow}>
                                            <Text style={styles.dropdownLabel}>Crop Type</Text>
                                            <Dropdown
                                                style={styles.dropdown}
                                                data={cropTypeDropdown}
                                                labelField="label"
                                                valueField="value"
                                                value={values.plotName}
                                                onChange={item => setFieldValue('pumpElectricPhase', item.value)}
                                                placeholder="Select Electric Phase"
                                            />
                                        </View>
                                        <View style={styles.dropdownRow}>
                                            <Text style={styles.dropdownLabel}>Cultivation Type</Text>
                                            <Dropdown
                                                style={styles.dropdown}
                                                data={CropCultivaionTypeOptions}
                                                labelField="label"
                                                valueField="value"
                                                value={values.plotName}
                                                onChange={item => setFieldValue('pumpElectricPhase', item.value)}
                                                placeholder="Select Electric Phase"
                                            />
                                        </View>
                                        <View style={styles.checkboxRow}>
                                            <TouchableOpacity
                                                style={styles.checkbox}
                                                onPress={() => setFieldValue('isRiser', !values.isRiser)}
                                            >
                                                <MaterialCommunityIcons
                                                    name={values.isRiser ? 'checkbox-marked' : 'checkbox-blank-outline'}
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
                                                placeholder="Select Nursery Raised Date"
                                                required={true}
                                            />
                                        </View>
                                     <AppTextInput
                                            placeholder="Planting Crop Company"
                                            maxLength={45}
                                            onBlur={handleBlur('plotName')}
                                            value={values.plotName}
                                            required={true}
                                            error={touched.plotName && errors.plotName ? errors.plotName : ''}
                                            onChangeText={handleChange('plotName')} />
                                        <AppTextInput
                                            placeholder="Planting Crop Variety"
                                            onBlur={handleBlur('plotLength')}
                                            keyboardType="decimal-pad"
                                            value={values.plotLength}
                                            required={true}
                                            error={touched.plotLength && errors.plotLength ? errors.plotLength : ''}
                                            onChangeText={handleChange('plotLength')} />
                                        <View style={styles.checkboxRow}>
                                            <TouchableOpacity
                                                style={styles.checkbox}
                                                onPress={() => setFieldValue('isRiser', !values.isRiser)}
                                            >
                                                <MaterialCommunityIcons
                                                    name={values.isRiser ? 'checkbox-marked' : 'checkbox-blank-outline'}
                                                    size={22}
                                                    color="#388e3c"
                                                />
                                            </TouchableOpacity>
                                            <Text style={styles.checkboxLabel}>Drip</Text>
                                            <TouchableOpacity
                                                style={styles.checkbox}
                                                onPress={() => setFieldValue('isRiser', !values.isRiser)}
                                            >
                                                <MaterialCommunityIcons
                                                    name={values.isRiser ? 'checkbox-marked' : 'checkbox-blank-outline'}
                                                    size={22}
                                                    color="#388e3c"
                                                />
                                            </TouchableOpacity>
                                            <Text style={styles.checkboxLabel}>Sprinkler</Text>
                                            <TouchableOpacity
                                                style={styles.checkbox}
                                                onPress={() => setFieldValue('isRiser', !values.isRiser)}
                                            >
                                                <MaterialCommunityIcons
                                                    name={values.isRiser ? 'checkbox-marked' : 'checkbox-blank-outline'}
                                                    size={22}
                                                    color="#388e3c"
                                                />
                                            </TouchableOpacity>
                                            <Text style={styles.checkboxLabel}>Flood</Text>
                                        </View>
                                             <View style={styles.checkboxRow}>
                                            <TouchableOpacity
                                                style={styles.checkbox}
                                                onPress={() => setFieldValue('isRiser', !values.isRiser)}
                                            >
                                                <MaterialCommunityIcons
                                                    name={values.isRiser ? 'checkbox-marked' : 'checkbox-blank-outline'}
                                                    size={22}
                                                    color="#388e3c"
                                                />
                                            </TouchableOpacity>
                                            <Text style={styles.checkboxLabel}>Nursery Raised</Text>
                                        </View>

                        
                                        <AppTextInput
                                            placeholder="Bed Count"
                                            onBlur={handleBlur('plotRiserDistance')}
                                            required={true}
                                            error={touched.plotRiserDistance && errors.plotRiserDistance ? errors.plotRiserDistance : ''}
                                            keyboardType="decimal-pad"
                                            value={values.plotRiserDistance}
                                            onChangeText={handleChange('plotRiserDistance')} />
                                        <View style={styles.dropdownRow}>
                                            <Dropdown
                                                style={styles.dropdown}
                                                data={plantationOptions}
                                                labelField="soilColor"
                                                valueField="code"
                                                value={values.soilId}
                                                onChange={item => setFieldValue('soilId', item.value)}
                                                placeholder="Plantation"
                                            />
                                        </View>
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
                        </ScrollView>
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
