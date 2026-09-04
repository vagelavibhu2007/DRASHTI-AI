import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import IndiaRiskMap from '../components/map/IndiaRiskMap';
import { Map, Layers, ShieldCheck } from 'lucide-react';

export const GeographicRisk = () => {
  return (
    <PageContainer
      breadcrumbs={[{ label: 'Geographic Risk Intelligence' }]}
      title="Geographic Risk Radar (India)"
      subtitle="Spatial distribution of infrastructure project risk across India."
    >
      <IndiaRiskMap />
    </PageContainer>
  );
};

export default GeographicRisk;

