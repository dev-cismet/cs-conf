TRUNCATE TABLE cs_type CASCADE; ALTER SEQUENCE cs_type_sequence RESTART WITH 1;
TRUNCATE TABLE cs_attr CASCADE; ALTER SEQUENCE cs_class_attr_sequence RESTART WITH 1;
TRUNCATE TABLE cs_class_attr CASCADE; ALTER SEQUENCE cs_attr_sequence RESTART WITH 1;
TRUNCATE TABLE cs_class CASCADE; ALTER SEQUENCE cs_class_sequence RESTART WITH 1;
TRUNCATE TABLE cs_cat_link CASCADE; ALTER SEQUENCE cs_cat_link_sequence RESTART WITH 1;
TRUNCATE TABLE cs_cat_node CASCADE; ALTER SEQUENCE cs_cat_node_sequence RESTART WITH 1;
TRUNCATE TABLE cs_dynamic_children_helper CASCADE; ALTER SEQUENCE cs_dynamic_children_helper_sequence RESTART WITH 1;
TRUNCATE TABLE cs_config_attr_jt CASCADE; ALTER SEQUENCE cs_config_attr_jt_sequence RESTART WITH 1;
TRUNCATE TABLE cs_config_attr_exempt CASCADE; ALTER SEQUENCE cs_config_attr_exempt_sequence RESTART WITH 1;
TRUNCATE TABLE cs_config_attr_key CASCADE; ALTER SEQUENCE cs_config_attr_key_sequence RESTART WITH 1;
TRUNCATE TABLE cs_config_attr_value CASCADE; ALTER SEQUENCE cs_config_attr_value_sequence RESTART WITH 1;
TRUNCATE TABLE cs_config_attr_type CASCADE; ALTER SEQUENCE cs_config_attr_type_sequence RESTART WITH 1;
TRUNCATE TABLE cs_icon CASCADE; ALTER SEQUENCE cs_icon_sequence RESTART WITH 1;
TRUNCATE TABLE cs_java_class CASCADE; ALTER SEQUENCE cs_java_class_sequence RESTART WITH 1;
--TRUNCATE TABLE cs_permission CASCADE; ALTER SEQUENCE cs_permission_sequence RESTART WITH 1;
TRUNCATE TABLE cs_policy_rule CASCADE; ALTER SEQUENCE cs_policy_rule_sequence RESTART WITH 1;
--TRUNCATE TABLE cs_policy CASCADE; ALTER SEQUENCE cs_policy_sequence RESTART WITH 1;
TRUNCATE TABLE cs_usr CASCADE; ALTER SEQUENCE cs_usr_sequence RESTART WITH 1;
TRUNCATE TABLE cs_ug_attr_perm CASCADE; ALTER SEQUENCE cs_ug_attr_perm_sequence RESTART WITH 1;
TRUNCATE TABLE cs_ug_cat_node_perm CASCADE; ALTER SEQUENCE cs_ug_cat_node_perm_sequence RESTART WITH 1;
TRUNCATE TABLE cs_ug_class_perm CASCADE; ALTER SEQUENCE cs_ug_class_perm_sequence RESTART WITH 1;
TRUNCATE TABLE cs_ug_membership CASCADE; ALTER SEQUENCE cs_ug_membership_sequence RESTART WITH 1;
TRUNCATE TABLE cs_ug CASCADE; ALTER SEQUENCE cs_ug_sequence RESTART WITH 1;
TRUNCATE TABLE cs_domain CASCADE; ALTER SEQUENCE cs_domain_sequence RESTART WITH 1;
TRUNCATE TABLE cs_scheduled_serveractions CASCADE; ALTER SEQUENCE cs_scheduled_serveractions_sequence RESTART WITH 1;