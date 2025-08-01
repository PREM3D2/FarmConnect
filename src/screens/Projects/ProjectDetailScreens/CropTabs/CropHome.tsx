import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, } from 'react-native';
import * as Yup from 'yup';
import LandService from '../../../../services/LandService';
import { useNavigation, useRoute } from '@react-navigation/core';
import { Project } from '../../ProjectListScreen';
import CropService from '../../../../services/CropService';
import { Plot } from '.././Land';
import { Card, Divider, PaperProvider } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


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

// const cropTypeDropdown = [
//     { label: 'Main', value: 'main' },
//     { label: 'Protection', value: 'protection' },
//     { label: 'Border', value: 'border' },
// ];

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


const CropHome: React.FC<{ project: Project, cropCode: number, isFocused: boolean}> = ({ project, cropCode, isFocused }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const route = useRoute();

    const [editLand, setEditLand] = useState<CropDetail | null>(null);
    const [cropDetail, setCropDetail] = useState<any>();
    const [reloadList, setReloadList] = useState(false);

    const [expandedItemCode, setExpandedItemCode] = useState<number | null>(null);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchCropDetail = async () => {
            if (typeof project?.projectId !== 'number') return;
            try {
                const response = await CropService.getcropDetailbycropid(project.projectId, cropCode);
                setCropDetail(response.result || []);
            } catch (error) {
            }
        };
        fetchCropDetail();
    }, [reloadList,isFocused]);

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

    const formatDate = (dateStr: any, withTime = false) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            ...(withTime && { hour: '2-digit', minute: '2-digit', hour12: true })
        };
        return date.toLocaleString('en-US', options);
    };

    const irrigationTypes = [];
    if (cropDetail?.irrigationDrip) irrigationTypes.push('Drip')
    if (cropDetail?.irrigationSprinker) irrigationTypes.push('Sprinkler')
    if (cropDetail?.irrigationFlood) irrigationTypes.push('Flood')

    return (
        <PaperProvider>
            <ScrollView contentContainerStyle={styles.container}>
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.row}><MaterialCommunityIcons name="map-marker" size={18} color="#333" />  Land: {cropDetail?.plotName}</Text>
                        <Text style={styles.row}><MaterialCommunityIcons name="leaf" size={18} color="#4CAF50" />  Cultivation Type: {cropDetail?.cropCultivationType}</Text>
                        <Text style={styles.row}><MaterialCommunityIcons name="office-building" size={18} color="#607D8B" />  Crop Type: {cropDetail?.cropType}</Text>
                        <Text style={styles.row}><MaterialCommunityIcons name="tag" size={18} color="#9C27B0" />  Plantation Method: {cropDetail?.plantationMethod}</Text>

                        <Divider style={styles.divider} />
                        {!(cropDetail?.cropCultivationType === 'sowing') && <Text style={styles.row}><MaterialCommunityIcons name="calendar" size={18} color="#3F51B5" />  Nursery Raised: {formatDate(cropDetail?.plantationNurseryRaised)}</Text>}

                        <Text style={styles.row}><MaterialCommunityIcons name="water" size={18} color="#2196F3" />  Irrigation: {irrigationTypes.join(', ')}</Text>
                        <Text style={styles.row}><MaterialCommunityIcons name="cube-outline" size={18} color="#009688" />  Stacking: {formatDate(cropDetail?.stackingDate)}</Text>
                        {(cropDetail?.protectionsRequired) &&
                            <>
                                <Divider style={styles.divider} />
                                <Text style={styles.section}><MaterialCommunityIcons name="shield" size={18} color="#FF9800" />  Protections:</Text>
                                <Text style={styles.subItem}>- Required: {cropDetail?.protectionsRequiredCount}</Text>
                                <Text style={styles.subItem}>- Deployed: {cropDetail?.protectionsDeployedCount}</Text>
                            </>}
                        <Divider style={styles.divider} />
                        <Text style={styles.section}><MaterialCommunityIcons name="tractor" size={18} color="#795548" />  Cultivation:</Text>
                        <Text style={styles.subItem}>- Expected: {formatDate(cropDetail?.cultivationExpectedDate)}</Text>
                        <Text style={styles.subItem}>- Actual: {formatDate(cropDetail?.cultivationActualDate)}</Text>

                        <Divider style={styles.divider} />
                        <Text style={styles.section}><MaterialCommunityIcons name="corn" size={18} color="#8BC34A" />  Harvest Start:</Text>
                        <Text style={styles.subItem}>- Expected: {formatDate(cropDetail?.harvestStartExpectedDate)}</Text>
                        <Text style={styles.subItem}>- Actual: {formatDate(cropDetail?.harvestStartActualDate)}</Text>

                        <Divider style={styles.divider} />
                        <Text style={styles.section}><MaterialCommunityIcons name="chart-bar" size={18} color="#03A9F4" />  Yield Interval:</Text>
                         <Text style={styles.subItem}>-Harvest Yield Expected(Kilos) :<Text style={styles.subItem}>{cropDetail?.harvestYieldKilosCollected}</Text> </Text>
                                                        <Text style={styles.subItem}>-Harvest Yield Expected Interval Count : <Text style={styles.subItem}>{cropDetail?.harvestIntervalCountExpected}</Text> </Text>
                        <Text style={styles.subItem}>-Total Yield Collected(Kilos) : <Text style={styles.subItem}>{cropDetail?.harvests?.map((item: any) => { return item.yieldCollectedKillosCount }).reduce((sum: number, num: number) => sum + num, 0)}</Text> </Text>
                        <Text style={styles.subItem}>-Total Yield Interval Count :<Text style={styles.subItem}> {cropDetail?.harvests.length} </Text></Text>
                        <Divider style={styles.divider} />
                        <Text style={styles.section}><MaterialCommunityIcons name="calendar-end" size={18} color="#E91E63" />  Harvest End:</Text>
                        <Text style={styles.subItem}>- Expected: {formatDate(cropDetail?.harvestEndExpectedDate)}</Text>
                        <Text style={styles.subItem}>- Actual: {formatDate(cropDetail?.harvestEndActualDate)}</Text>

                        <Divider style={styles.divider} />
                        <Text style={styles.section}><MaterialCommunityIcons name="shovel" size={18} color="#6D4C41" />  Uproot:</Text>
                        <Text style={styles.subItem}>- Expected: {formatDate(cropDetail?.uprootingExpectedDate)}</Text>
                        <Text style={styles.subItem}>- Actual: {formatDate(cropDetail?.uprootingActualDate)}</Text>
                    </Card.Content>
                </Card>
            </ScrollView>
        </PaperProvider>

    );
};

const styles = StyleSheet.create({
    container: { padding: 16, marginVertical: 20, paddingBottom: 50 },
    card: { borderRadius: 12, elevation: 3, backgroundColor: "#fff" },
    row: { fontSize: 16, marginVertical: 4 },
    section: { fontSize: 16, marginTop: 10, fontWeight: 'bold' },
    subItem: { fontSize: 15, marginLeft: 20, marginVertical: 2 },
    divider: { marginVertical: 8 },

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
    // card: {
    //     backgroundColor: '#fff',
    //     borderRadius: 10,
    //     padding: 16,
    //     marginBottom: 16,
    //     elevation: 2,
    // },
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

export default CropHome;
