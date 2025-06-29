// pages/Home.jsx
import React, { useEffect } from 'react';
import Hero from '../components/Layout/Hero';
import DomainCourses from '../components/Courses/DomainCourses';
import LoadMore from '../components/Common/LoadMore';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSections } from '../redux/slices/sectionsSlice';
import { fetchDomainsBySection } from '../redux/slices/domainsSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { sections, loading } = useSelector(state => state.sections);
  const { domains } = useSelector(state => state.domains); // you already have this

  useEffect(() => {
    dispatch(fetchSections());
  }, [dispatch]);

  return (
    <div>
      <Hero />
      {!loading && sections.map(section => (
        <div key={section._id}>
          
          {/* Dispatch fetchDomainsBySection for each section */}
          <DynamicDomains sectionName={section.name} />
          <LoadMore x={section.name} />
        </div>
      ))}
    </div>
  );
};

const DynamicDomains = ({ sectionName }) => {
  const dispatch = useDispatch();
  const [firstDomain, setFirstDomain] = React.useState(null);

  useEffect(() => {
    const fetchDomains = async () => {
      const res = await dispatch(fetchDomainsBySection(sectionName));
      if (res.payload && res.payload.length > 0) {
        setFirstDomain(res.payload[0]);  // pick only the first domain
      }
    };
    fetchDomains();
  }, [dispatch, sectionName]);

  return (
    <>
      {firstDomain && <DomainCourses domain={firstDomain} />}
    </>
  );
};


export default Home;
