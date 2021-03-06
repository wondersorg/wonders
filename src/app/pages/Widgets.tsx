import React from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
const { ipcRenderer } = window.require("electron-better-ipc");

import { BaseButton } from "../components/BaseButton";
import { WidgetCard } from "../components/WidgetCard";

import constants from "../../api/Constants";

/* Styles */
const ButtonContainer = styled.div`
  height: fit-content;
  width: auto;
  margin: 1rem 1rem 0 1rem;
  //padding: .25rem;
  //border: 1px solid var(--border-color);
  border-radius: 7px;
  flex-grow: 1;
`;

const OptionButton = styled(BaseButton)`
  min-width: 5rem;
  transition: .125s ease;
`;

const WidgetCardContainer = styled.div`
  height: fit-content;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: min-content;
  grid-auto-flow: dense;
  grid-auto-rows: min-content;
  grid-row-gap: 0;

  @media only screen and (min-width : 1330px) {
    & {
      grid-template-columns: repeat(3, 1fr);
    }
  }
`;

const PageWrapper = styled(motion.div)`
  height: 100%;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
`;

/* Main Component */
export const Widgets: React.FC = () => {
  const [ widgets, setWidgets ] = React.useState<object[]>([]);

  const getWidgets = () => {
    ipcRenderer.callMain(constants.ipcMessages.GET_WIDGETS).then((ws: any) => setWidgets(ws));
  }

  const reloadWidgets = () => {
    ipcRenderer.callMain(constants.ipcMessages.RELOAD_WIDGETS).then((ws: any) => setWidgets(ws));
  }

  const enableAll = () => {
    ipcRenderer.callMain(constants.ipcMessages.ENABLE_ALL_WIDGETS).then((ws: any) => setWidgets(ws));
  }

  const disableAll = () => {
    ipcRenderer.callMain(constants.ipcMessages.DISABLE_ALL_WIDGETS).then((ws: any) => setWidgets(ws));
  }

  React.useEffect(() => {
    getWidgets();
  }, [])

  if (widgets.length === 0) {
    return (
      <>
        <h1 style={{ fontSize: '4rem', paddingBottom: '1rem' }}>No widgets available.</h1>
        <p style={{ fontSize: '1.25rem' }}>Are you sure you have any widgets installed?</p>
      </>
    );
  } else {
    return (
      <PageWrapper>
        <ButtonContainer>
          <OptionButton onClick={() => enableAll()}>Enable All</OptionButton>
          <OptionButton onClick={() => disableAll()}>Disable All</OptionButton>
          <OptionButton onClick={() => getWidgets()}>Refresh</OptionButton>
          <OptionButton onClick={() => reloadWidgets()}>Reload</OptionButton>
        </ButtonContainer>
        <WidgetCardContainer>
          {
            widgets.length === 0
            ? (
                <>
                  <h1 style={{ fontSize: '4rem', paddingBottom: '1rem' }}>No widgets available.</h1>
                  <p style={{ fontSize: '1.25rem' }}>Are you sure you have any widgets installed?</p>
                </>
              )
            : widgets.map((f: any) => <WidgetCard key={f.id} click={getWidgets} widget={f} />)
          }
        </WidgetCardContainer>
      </PageWrapper>
    );
  }
}
