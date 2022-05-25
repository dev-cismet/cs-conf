export const configAttr = `
SELECT 
    u.login_name,
    md.name domainname,
    ug.name||'@'||ugd.name groupkey,
    k.key,
    k.group_name keygroup,
    t.type,
    v.value
FROM 
    cs_config_attr_jt jt
    INNER JOIN cs_config_attr_key k ON (jt.key_id=k.id)
    INNER JOIN cs_config_attr_type t ON (jt.type_id=t.id)
    INNER JOIN cs_config_attr_value v ON (jt.val_id=v.id) 
    LEFT OUTER JOIN cs_domain md ON (jt.dom_id=md.id)
    LEFT OUTER JOIN cs_usr u ON (jt.usr_id=u.id) 
    LEFT OUTER JOIN cs_ug ug ON (jt.ug_id=ug.id) LEFT OUTER JOIN cs_domain ugd ON (ug."domain"=ugd.id)
ORDER BY 4,3,1,5,6,7;
`;

const _domains = 'SELECT name AS domainname FROM cs_domain';
export const domainsByKey = _domains + ' ORDER BY name;';
export const domainsById = _domains + ' ORDER BY id;';

const _policyDefaults = `
SELECT cs_policy.name AS policy, cs_permission.key AS permission, default_value AS default_value
FROM cs_policy_rule, cs_policy, cs_permission 
WHERE 
    cs_policy_rule.policy = cs_policy.id 
    and cs_policy_rule.permission = cs_permission.id
`;
export const policyDefaultsByKey = _policyDefaults + ' ORDER BY cs_policy.name, cs_permission.key;';
export const policyDefaultsById = _policyDefaults + ' ORDER BY cs_policy_rule.id;';

const _users = ` 
SELECT login_name, last_pwd_change, administrator, trim(pw_hash) AS pw_hash, trim(salt) AS salt
FROM cs_usr
`;
export const usersByKey = _users + ' ORDER BY login_name;';
export const usersById = _users + ' ORDER BY id;';

const _usergroups = `
SELECT 
    cs_domain.name AS domain,
    cs_ug.name AS name, 
    cs_ug.descr AS descr
FROM cs_ug, cs_domain 
WHERE cs_ug.domain = cs_domain.id
`;
export const usergroupsByKey = _usergroups + ' ORDER BY cs_domain.name, cs_ug.name;';
export const usergroupsById = _usergroups + ' ORDER BY cs_ug.id;';

export const usergroupmembership = ` 
select distinct
    login_name, d.name domainname, g.name groupname
from 
    cs_ug_membership m 
    INNER JOIN cs_usr u ON (m.usr_id=u.id)
    INNER JOIN cs_ug g ON (m.ug_id=g.id) 
    INNER JOIN cs_domain d ON (d.id=g.domain)
order by 1,2,3;
`;

const _classes = `
SELECT 
    c.table_name "table", c.name,c.descr,c.primary_key_field pk,c.indexed,
    ci.file_name "classIcon", oi.file_name "objectIcon", null as icon,
    jcs.type toStringType, jcs.qualifier toStringClass,
    jce.type editorType, jce.qualifier editorClass,
    jcr.type rendererType, jcr.qualifier rendererClass,
    c.array_link,
    cp.name "policy", ap.name attribute_policy
FROM 
    cs_class c 
    LEFT OUTER JOIN cs_icon ci ON (c.class_icon_id=ci.id)
    LEFT OUTER JOIN cs_icon oi ON (c.object_icon_id=oi.id)
    LEFT OUTER JOIN cs_java_class jcs on (c.tostring=jcs.id)
    LEFT OUTER JOIN cs_java_class jce on (c.editor=jce.id)
    LEFT OUTER JOIN cs_java_class jcr on (c.renderer=jcr.id)
    LEFT OUTER JOIN cs_policy cp on (c.policy=cp.id)
    LEFT OUTER JOIN cs_policy ap on (c.attribute_policy=ap.id)
`;
export const classesByKey = _classes + ' ORDER BY c.table_name;';
export const classesById = _classes + ' ORDER BY c.id;';

export const attributes = `
SELECT 
    a.field_name field, a.name, c.table_name "table" ,a.descr,
    t.name "dbType",tc.table_name "cidsType",tc.table_name "oneToMany", tc.table_name "manyToMany", a.precision, a.scale, a.extension_attr, NOT a.optional mandatory, a.default_value "defaultValue",
    a.foreign_key, a.foreign_key_references_to "foreignKeyTableId", fkc.table_name foreignkeytable, a.substitute,
    NOT a.visible hidden, a.indexed,
    a.isarray "isArrray", a.array_key "arrayKey",
    jcs.type toStringType, jcs.qualifier toStringClass,
    jce.type editorType, jce.qualifier editorClass,
    jcce.type complexEditorType, jcce.qualifier complexEditorClass
FROM 
    cs_attr a
    LEFT OUTER JOIN cs_class c ON (a.class_id=c.id)
    LEFT OUTER JOIN cs_type t ON (a.type_id=t.id)
    LEFT OUTER JOIN cs_class tc ON (t.class_id=tc.id)
    LEFT OUTER JOIN cs_class fkc ON (a.foreign_key_references_to=fkc.id)
    LEFT OUTER JOIN cs_java_class jcs on (c.tostring=jcs.id)
    LEFT OUTER JOIN cs_java_class jce on (c.editor=jce.id)
    LEFT OUTER JOIN cs_java_class jcce on (c.renderer=jcce.id)
ORDER BY
    c.table_name, a.pos;
`;

const _classAttributes = `
SELECT cs_class.table_name AS table, attr_key AS key, attr_value AS value 
FROM cs_class_attr
JOIN cs_class ON (cs_class.id = cs_class_attr.class_id)
`;
export const classAttributesByKey = _classAttributes + ' ORDER BY cs_class.table_name, attr_key;';
export const classAttributesById = _classAttributes + ' ORDER BY cs_class_attr.id;';

const _classPermissions = `
SELECT
    cs_domain.name AS domain, cs_ug.name AS group, cs_class.table_name AS table, cs_permission.key AS permission
FROM
    cs_ug_class_perm
    JOIN cs_permission ON (cs_permission.id = cs_ug_class_perm.permission)
    JOIN cs_class ON (cs_ug_class_perm.class_id = cs_class.id)
    JOIN cs_ug ON (cs_ug_class_perm.ug_id = cs_ug.id)
    JOIN cs_domain ON (cs_ug.domain = cs_domain.id)
`;
export const classPermissionsByKey = _classPermissions + ' ORDER BY cs_class.table_name, cs_domain.name, cs_ug.name;';
export const classPermissionsById = _classPermissions + ' ORDER BY cs_ug_class_perm.id;';

const _attributePermissions = `
SELECT
    cs_domain.name AS domain, cs_ug.name AS group, cs_class.table_name AS table, cs_attr.field_name AS field, cs_permission.key AS permission
FROM
    cs_ug_attr_perm 
    JOIN cs_permission ON (cs_permission.id = cs_ug_attr_perm.permission)
    JOIN cs_attr ON (cs_ug_attr_perm.attr_id = cs_attr.id)
    JOIN cs_class ON (cs_attr.class_id = cs_class.id)
    JOIN cs_ug ON (cs_ug_attr_perm.ug_id = cs_ug.id)
    JOIN cs_domain ON (cs_ug.domain = cs_domain.id)
`;
export const attributePermissionsByKey = _attributePermissions + ' ORDER BY cs_class.table_name, cs_domain.name, cs_ug.name;';
export const attributePermissionsById = _attributePermissions + ' ORDER BY cs_ug_attr_perm.id';

export const _nodes = `
SELECT 
    n.id, n.name, n.url as descr, c.table_name as table, 
    n.derive_permissions_from_class, n.object_id, n.node_type, n.is_root, n.org, 
    n.dynamic_children, n.sql_sort, p.name "policy", iconfactory, icon, artificial_id
FROM
    cs_cat_node n
    LEFT OUTER JOIN cs_class "c" ON (n.class_id=c.id)
    LEFT OUTER JOIN cs_policy p ON (n.policy=p.id)
`;
export const nodesByKey = _nodes + ' ORDER BY n.name;';
export const nodesById = _nodes + ' ORDER BY n.id';

const _dynchildhelpers = `
SELECT 
    id, name, code
FROM
    cs_dynamic_children_helper
`;
export const dynchildhelpersByKey = _dynchildhelpers + ' ORDER BY name;';
export const dynchildhelpersById = _dynchildhelpers + ' ORDER BY id';

export const links = `
SELECT 
    id_from,id_to,org 
FROM 
    cs_cat_link l
    JOIN cs_domain d ON (d.id=l.domain_to)
WHERE 
    d.name = 'LOCAL' OR d.name = 'WUNDA_BLAU';     
`;

export const nodePermissions = `
SELECT 
    d.name "domain", g.name "group", cnp.cat_node_id, p."key" "permission"
FROM 
    cs_ug_cat_node_perm cnp
    JOIN cs_permission p ON (p.id=cnp.permission)
    JOIN cs_ug g ON (cnp.ug_id=g.id)
    JOIN cs_domain d ON (g.domain=d.id)
ORDER BY g.name, d.name, p.key;
`;