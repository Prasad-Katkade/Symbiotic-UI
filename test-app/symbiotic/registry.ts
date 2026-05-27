import { ReactNode } from 'react';

export const RuntimeComponentMap = new Map<string, any>();
export const RuntimeFunctionCache = new Map<string, Function>();
export const RuntimeStaticCache = new Map<string, ReactNode>(); // NEW