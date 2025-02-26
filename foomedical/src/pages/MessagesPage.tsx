import { useState, useCallback, useMemo } from 'react';
import { Alert } from '@mantine/core';
import { Communication, Patient } from '@medplum/fhirtypes';
import { createReference, getReferenceString, normalizeErrorString } from '@medplum/core';
import { BaseChat, Document, useMedplum, useMedplumProfile } from '@medplum/react';
import { showNotification } from '@mantine/notifications';
import { IconCircleOff } from '@tabler/icons-react';

export function Messages(): JSX.Element {
  const medplum = useMedplum();
  const profile = useMedplumProfile() as Patient;
  const profileRef = useMemo(() => (profile ? createReference(profile) : undefined), [profile]);
  const [communications, setCommunications] = useState<Communication[]>([]);

  const sendMessage = useCallback(
    (content: string): void => {
      if (!profileRef) {
        return;
      }

      medplum
        .createResource<Communication>({
          resourceType: 'Communication',
          status: 'in-progress',
          sender: profileRef,
          subject: profileRef,
          sent: new Date().toISOString(),
          payload: [{ contentString: content }],
        })
        .catch((err) => {
          showNotification({
            color: 'red',
            icon: <IconCircleOff />,
            title: 'Error',
            message: normalizeErrorString(err),
          });
        });
    },
    [medplum, profileRef]
  );

  const handleMessageReceived = useCallback(
    (message: Communication): void => {
      if (message.received) {
        return;
      }

      medplum
        .updateResource<Communication>({
          ...message,
          status: 'completed',
          received: new Date().toISOString(),
        })
        .catch((err) => {
          showNotification({
            color: 'red',
            icon: <IconCircleOff />,
            title: 'Error',
            message: normalizeErrorString(err),
          });
        });
    },
    [medplum]
  );

  if (!profileRef) {
    return <Alert color="red">Error: Provider profile not found</Alert>;
  }

  return (
    <Document width={800}>
      <BaseChat
        title="Send us a message"
        query={`subject=${getReferenceString(profile)}`}
        communications={communications}
        setCommunications={setCommunications}
        sendMessage={sendMessage}
        onMessageReceived={handleMessageReceived}
        h={600}
      />
    </Document>
  );
}
