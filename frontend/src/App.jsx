import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UserLayout from "./components/Layout/UserLayout";
import Home from "./pages/Home"
import {Toaster} from "sonner"
import Login from './pages/Login';
import Register from './pages/Register';
import Tech from './pages/tech';
import CompetitiveExams from './pages/CompetitiveExams';
import Skills from './pages/Skills';
import School from './pages/School';
import NotFound from './pages/NotFound';
import AdminLayout from './components/Admin/AdminLayout';
import AdminHomePage from './pages/AdminHomePage';
import UserManagement from './components/Admin/UserManagement';
import CourseManagement from './components/Admin/CourseManagement';
import EditCoursePage from './components/Admin/EditCoursePage';
import {Provider} from "react-redux";
import store from "./redux/store";


const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
      <Toaster position="top-right"/>
      <Routes>
        <Route path="/" element={<UserLayout/>}>
          <Route index element={<Home/>}/>
          <Route path="login" element={<Login/>}/>
          <Route path="register" element={<Register/>}/>
          <Route path="/tech" element={<Tech />} />
          <Route path="/competitive_exams" element={<CompetitiveExams/>} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/school" element={<School />} />
          {/* <Route path="*" element={<NotFound />} /> */}

        </Route>
        <Route path="/admin" element={<AdminLayout/>}>
          <Route index element={<AdminHomePage/>}/>
          <Route path="users" element={<UserManagement/>}/>
          <Route path="courses" element={<CourseManagement/>}/>
          <Route path="courses/:id/edit" element={<EditCoursePage/>}/>
        </Route>
      </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App